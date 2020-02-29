import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { AsyncQueue, queue, retryable, retry, AsyncFunction } from "async";
import { IQueue } from "../interfaces";
import { singleton, injectable } from "tsyringe";
import { EntityRequest } from "../manager/EntityRequest";

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
                if (err) this._queue.pause();
                // if (!err) this._queue.resume();
                resolve(entity)
            })
        });
    }

    stream = () => Promise.resolve(this._store);

    push = (entityRequest: EntityRequest, task: () => Promise<T>) =>
        // TODO what probably needs to happen is whenever a new task is submitted, first query
        // the local repo and see if there are any EntityRequests with a EntityRequestStatus of failed (doesnt exist) and
        // throw any failed entity requests into a async series (https://caolan.github.io/async/v3/docs.html#series) and if
        // a task succeeds, update the EntityRequestStatus, if it fails cancel the whole thing, in this situation, I think the queue would
        // just be a glorified debounce
        new Promise(async resolve =>
            this._queue.push(
                await this._retry(task),
                () => resolve(entityRequest)
            ))
}