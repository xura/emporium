import { injectable } from "tsyringe";
import ky from "ky";
import { IAdapter } from "../interfaces/IAdapter";
import { AsyncQueue, queue, retryable, retry, AsyncFunction, AsyncResultCallback } from "async";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    request = (callback: AsyncResultCallback<unknown, Error>, results: any): ((callback: AsyncResultCallback<unknown, Error>, results: any) => void) => {
        debugger;
        return (callback, results) => {
            debugger;
            callback(new Error('hey there'))
        }
    }

    create(entity: T) {
        //return ky.post('https://httpbin.org/post').then(_ => entity);
        return new Promise<T>(async resolve => {
            retry(3, this.request((a: any, b: any) => {
                debugger;
            }, [1, 2, 3]), (a: any, b: any) => {
                debugger;
                resolve()
            })
        })
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
