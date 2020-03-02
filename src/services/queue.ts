import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { AsyncQueue, queue, asyncify, retry, series } from "async";
import { IQueue, IConnection } from "../interfaces";
import { singleton, injectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus } from "../manager/EntityRequest";
import { inject } from "tsyringe";
import { Repository } from "typeorm";
import errors from "../shared/errors";
import { orderBy, sortBy } from 'lodash/fp';

@injectable()
@singleton()
export class Queue<T> implements IQueue<T> {
    private _store: BehaviorSubject<[number, T]> =
        new BehaviorSubject([1, {} as T]);

    private _queue: AsyncQueue<T> =
        queue((task, callback) => {
            debugger;
            callback()
        }, 1);

    private _retry = (task: () => Promise<any>) => {

        const request = () =>
            (callback: (err: Error | null, entity?: T) => void) =>
                task()
                    .then(entity => callback(null, entity))
                    .catch(err => callback(err))

        return new Promise<T>((resolve, reject) => {
            debugger;

            return retry(3, request(), (err, entity: T) => {
                if (err) {
                    // this._queue.remove(() => true);
                    // resolve()
                }
                // if (!err) this._queue.resume();
                resolve(entity)
            })
        });
    }

    _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    constructor(
        @inject("IConnection") private connection?: IConnection
    ) {
        const cxn = this.connection;

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    stream = () => Promise.resolve(this._store);

    push = async (entityRequest: EntityRequest, task: () => Promise<T>) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))
        // TODO what probably needs to happen is whenever a new task is submitted, first query
        // the local repo and see if there are any EntityRequests with a EntityRequestStatus of failed (doesnt exist) and
        // throw any failed entity requests into a async series (https://caolan.github.io/async/v3/docs.html#series) 
        // and push all of those requests to the queue and if
        // a task succeeds, update the EntityRequestStatus, if it fails cancel the whole thing, in this situation, I think the queue would
        // just be a glorified debounce

        // TODO series wont work because what if another request comes in while series is executing, so we probably just want to try to 
        // add all incomplete tasks en masse (queue.push takes an array of tasks)
        const unprocessedEntityRequests = orderBy('DateCreated')('desc')(await this._getRequestRepo().find({
            RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY
        }))

        // debugger;

        // const t = async (callback: any) => {
        //     debugger;
        //     await this._retry(task)
        //     callback(null, '23r23r2')
        // }

        // if (this._queue.idle() && !!unprocessedEntityRequests.length) {
        //     return new Promise(async resolve =>
        //         series([
        //             t, t, t
        //         ], (err, results) => {
        //             debugger;
        //             resolve()
        //         }))
        // }

        return new Promise(async resolve =>
            this._queue.push(
                await this._retry(task),
                () => resolve(entityRequest)
            ))
    }
}