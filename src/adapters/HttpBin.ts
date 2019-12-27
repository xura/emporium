import { singleton, injectable } from "tsyringe";
import { Subject } from "rxjs";
import { AsyncQueue, queue } from "async";
import ky from "ky";
import { IRepository } from "../interfaces/IRepository";

@injectable()
export class HttpBin<T> implements IRepository<T> {
    private _store: Subject<T> = new Subject();
    // probably replace this queue with bottleneck package
    // then store each queued task by id in localforage
    private _queue: AsyncQueue<T> = queue(
        (task: T, callback: () => void) => {
            this._store.next(task);
            callback();
        }, 2);

    save(entity: T) {
        this._queue.push(entity,
            () => ky.post('https://httpbin.org/post'));
        return Promise.resolve(entity);
    }

    find() {
        return Promise.resolve([]);
    }

    stream = () => Promise.resolve(this._store);
}
