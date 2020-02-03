import { injectable } from "tsyringe";
import { BehaviorSubject } from "rxjs";
import { AsyncQueue, queue } from "async";
import ky from "ky";
import { IRepository } from "../interfaces/IRepository";

@injectable()
export class HttpBin<T> implements IRepository<T> {
    private _store: BehaviorSubject<[number, T]> = new BehaviorSubject([1, {} as T]);
    // probably replace this queue with bottleneck package
    // then store each queued task by id in localforage
    private _queue: AsyncQueue<T> = queue(
        (task: T, callback: (finished: () => void) => void) => {
            this._store.next([0, task]);
            callback(() => this._store.next([1, task]));
        }, 2);

    save(entity: T) {
        this._queue.push(entity,
            (finished?: any) => ky.post('https://httpbin.org/post').then(finished));
        return Promise.resolve(entity);
    }

    find() {
        return Promise.resolve([]);
    }

    stream = () => Promise.resolve(this._store);
}
