import { injectable, inject } from "tsyringe";
import ky from "ky";
import { IAdapter, IQueue } from "../interfaces";
import { AsyncQueue, queue, retryable, retry, AsyncFunction, AsyncResultCallback } from "async";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    create = (entity: T) => {
        debugger;
        return ky.get('https://httpbin.org/status/200').then(_ => entity)
    }


    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
