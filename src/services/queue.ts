import { Subject } from "rxjs/internal/Subject";
import { AsyncQueue, queue, retry, series } from "async";
import { IQueue, IConnection, IAdapter } from "../interfaces";
import { singleton, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus } from "../manager/EntityRequest";
import { inject } from "tsyringe";
import { Repository } from "typeorm";
import errors from "../shared/errors";
import { orderBy } from 'lodash/fp';
import ExternalResource from "../manager/ExternalResource";

@autoInjectable()
@singleton()
export class Queue<T extends ExternalResource> implements IQueue<T> {

    processedExternally: Subject<T> = new Subject();

    private _initialQueue: () => AsyncQueue<any> = () => queue(
        async (task, callback) => task(callback)
        , 1);

    private _queue: AsyncQueue<any> = this._initialQueue()

    private _retry = (task: () => Promise<EntityRequest>) => {

        const request = () =>
            (callback: (err: Error | null, entityRequest?: EntityRequest) => void) =>
                task().then(entity => callback(null, entity)).catch(err => callback(err))

        return new Promise<EntityRequest>(resolve => retry(3, request(), (err, entity: EntityRequest) => {
            if (err) {
                this._queue = this._initialQueue()
                return;
            };
            resolve(entity)
        }));
    }

    private _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    private _getExternalRequest = async (entityRequest: EntityRequest) => {
        if (!this._externalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IAdapter']))

        return await this._retry(this._externalRepo.mapToExternalRequest(entityRequest))
    }

    private _markAsProcessedExternally = async (entityRequest: EntityRequest): Promise<T> => {
        const payload = JSON.parse(entityRequest.Payload)

        if (!payload.ExternalId)
            return Promise.reject('Trying to mark an Entity as processed externally with no ExternalId');

        if (!entityRequest.id)
            return Promise.reject('Trying to mark an EntityRequest as processed externally with no id');

        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return await this._getRequestRepo().update(entityRequest.id, {
            RequestStatus: EntityRequestStatus.PROCESSED_EXTERNALLY,
            Payload: entityRequest.Payload
        }).then(() => {
            this.processedExternally.next(payload)
            return payload;
        });
    }

    constructor(
        @inject("IConnection") private _connection?: IConnection,
        @inject("IAdapter") private _externalRepo?: IAdapter<T>,
    ) {

        const cxn = this._connection;

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    push = async (entityRequest: EntityRequest) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        const pendingEntityRequests = orderBy<EntityRequest>('DateCreated')('desc')(
            await this._getRequestRepo().find({
                RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY
            })
        )

        if (!this._queue.started && pendingEntityRequests.length > 1) {

            const externalRequests = pendingEntityRequests.map(entityRequest =>
                (callback: any) => this._getExternalRequest(entityRequest).then(entity =>
                    callback(null, this._markAsProcessedExternally(entity))
                )
            )

            return new Promise(async resolve =>
                this._queue.push(
                    async (callback: any) =>
                        await series(externalRequests, (err, results) => {
                            if (err) return callback(err)
                            return callback(null, results)
                        }),
                    () => resolve(entityRequest)
                ))
        }

        return new Promise(async resolve =>
            this._queue.push(
                (callback: any) => this._getExternalRequest(entityRequest).then(entity =>
                    callback(null, this._markAsProcessedExternally(entity))
                ),
                () => resolve(entityRequest)
            ))
    }
}