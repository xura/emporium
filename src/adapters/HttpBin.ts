import { injectable } from "tsyringe";
import { BehaviorSubject } from "rxjs";
import { AsyncQueue, queue } from "async";
import ky from "ky";
import { IAdapter } from "../interfaces/IAdapter";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    save(entity: T) {
        return ky.post('https://httpbin.org/post').then(_ => entity);
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
