import { injectable, inject } from "tsyringe";
import ky from "ky";
import { IAdapter, IQueue } from "../interfaces";
import { AsyncQueue, queue, retryable, retry, AsyncFunction, AsyncResultCallback } from "async";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    constructor(
        @inject("IQueue") private queue: IQueue<T>
    ) {

    }

    request = () => {
        debugger;
        return (callback: any, results: any) => {
            debugger;
            callback(new Error('hey there'))
        }
    }

    create(entity: T) {
        //return ky.post('https://httpbin.org/post').then(_ => entity);
        // return new Promise<T>(async resolve => {
        //     retry(3, this.request(), (a: any, b: any) => {
        //         debugger;
        //         resolve()
        //     })
        // })

        const request = () => async (callback: any, results: any) => {
            debugger;
            callback(
                await ky.post('https://httpbin.org/status/500')
                    .then(() => null)
                    .catch(() => new Error())
            )
        };

        return new Promise<T>(resolve => retry(1, request(), (err) => {
            debugger;
            if (err) this.queue.pause();

            resolve(entity)
        }))
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
