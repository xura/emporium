import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { AsyncQueue, queue } from "async";
import { IQueue } from "../interfaces/IQueue";
import { singleton } from "tsyringe";

@singleton()
export class Queue<T> implements IQueue<T> {
    private _store: BehaviorSubject<[number, T]> = new BehaviorSubject([1, {} as T]);
    // probably replace this queue with bottleneck package
    // then store each queued task by id in localforage
    private _queue: AsyncQueue<T> = queue(
        (task: T, callback: (finished: () => void) => void) => {
            this._store.next([0, task]);
            callback(() => this._store.next([1, task]));
        }, 2);

    stream = () => Promise.resolve(this._store);

    push = (task: T): Promise<T> => new Promise((resolve: any) => {
        this._queue.push(task, resolve)
    })

}