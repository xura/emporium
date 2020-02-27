import { injectable } from "tsyringe";
import ky from "ky";
import { IAdapter } from "../interfaces/IAdapter";
import { AsyncQueue, queue, retryable, retry, AsyncFunction, AsyncResultCallback } from "async";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    request = () => new Promise<any>((resolve: any) => {
        // setTimeout(() => {
        //     debugger;
        //     resolve(entity)
        // }, 5000)
        debugger;
        return Promise.reject()
    })

    create(entity: T) {
        //return ky.post('https://httpbin.org/post').then(_ => entity);
        return new Promise<T>(async resolve => {
            retry(3, await this.request(), () => resolve())
        })
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
