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
        queue((task, callback) => callback(), 2);

    private _retry = (task: () => Promise<any>) => {

        const request = () =>
            (callback: (err: Error | null, entity?: T) => void) =>
                task()
                    .then(entity => callback(null, entity))
                    .catch(err => callback(err))

        return new Promise<T>(resolve =>
            retry(3, request(), (err, entity: T) => {
                if (err) this._queue.pause();
                resolve(entity)
            }));
    }

    stream = () => Promise.resolve(this._store);

    push = (entityRequest: EntityRequest, task: () => Promise<T>) =>
        new Promise(async resolve =>
            this._queue.push(
                await this._retry(task),
                () => resolve(entityRequest)
            ))
}