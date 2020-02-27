import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { AsyncQueue, queue, retryable, AsyncFunction } from "async";
import { IQueue } from "../interfaces";
import { singleton, injectable } from "tsyringe";

@injectable()
@singleton()
export class Queue<T> implements IQueue<T> {
    private _store: BehaviorSubject<[number, T]> = new BehaviorSubject([1, {} as T]);
    // probably replace this queue with bottleneck package
    // then store each queued task by id in localforage
    private _queue: AsyncQueue<AsyncFunction<T, Error>> =
        queue(function (task, callback) {
            debugger;
            console.log(task);
            callback();
        }, 2);

    stream = () => Promise.resolve(this._store);

    submitRequest = async (task: Promise<T>) => {
        debugger;
        return Promise.reject(new Error())
    }

    push = (task: Promise<T>) => {
        debugger;
        return new Promise(async (resolve: any) =>
            this._queue.push(
                await retryable(5, await this.submitRequest(task)),
                resolve
            ))
    }

}