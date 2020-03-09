import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { AsyncQueue, queue, asyncify, retry, series } from "async";
import { IQueue, IConnection, IAdapter } from "../interfaces";
import { singleton, injectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus } from "../manager/EntityRequest";
import { inject } from "tsyringe";
import { Repository } from "typeorm";
import errors from "../shared/errors";
import { orderBy, map } from 'lodash/fp';
import ky from "ky";

@injectable()
@singleton()
export class Queue<T> implements IQueue<T> {
    private _store: BehaviorSubject<[number, T]> =
        new BehaviorSubject([1, {} as T]);

    private _queue: AsyncQueue<any> = queue((task, callback) => callback(), 1);

    private _retry = (task: () => Promise<T>) => {

        const request = () =>
            (callback: (err: Error | null, entityRequest?: T) => void) =>
                task()
                    .then(entity => callback(null, entity))
                    .catch(err => callback(err))

        return new Promise<T>((resolve, reject) => retry(3, request(), (err, entity: T) => {
            if (err) return this._queue.remove(() => true);
            resolve(entity)
        }));
    }

    private _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    private _getExternalRequest = (entityRequest: EntityRequest) => async () => {
        if (!this._externalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IAdapter']))

        return await this._retry(this._externalRepo.mapToExternalRequest<T>(entityRequest))
    }

    constructor(
        @inject("IConnection") private _connection?: IConnection,
        @inject("IAdapter") private _externalRepo?: IAdapter<T>,
    ) {
        const cxn = this._connection;

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    stream = () => Promise.resolve(this._store);

    push = async (entityRequest: EntityRequest) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        const pendingEntityRequests = orderBy<EntityRequest>('DateCreated')('desc')(
            await this._getRequestRepo().find({
                RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY
            })
        )

        if (this._queue.idle() && !!pendingEntityRequests.length) {

            const externalRequests = pendingEntityRequests.map(entityRequest =>
                this._getExternalRequest(entityRequest)
            )

            // TODO run callbacks for each external request that marks the request as PROCESSED_EXTERNALLY
            return new Promise(async resolve =>
                this._queue.push(
                    await series(externalRequests),
                    () => resolve(entityRequest)
                ))
        }

        return new Promise(async resolve =>
            this._queue.push(
                this._getExternalRequest(entityRequest),
                () => resolve(entityRequest)
            ))
    }
}