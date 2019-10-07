import { singleton, injectable } from "tsyringe";
import { Subject } from "rxjs";
import { AsyncQueue, queue } from "async";
import ky from "ky";
import { IRepository } from "../interfaces/IRepository";

@injectable()
@singleton()
export class HttpBin<T> implements IRepository<T> {
    private _store: Subject<T> = new Subject();
    private _queue: AsyncQueue<T> = queue(
        (task: T, callback: () => void) => {
            debugger;
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
