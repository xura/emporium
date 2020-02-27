import { injectable } from "tsyringe";
import ky from "ky";
import { IAdapter } from "../interfaces/IAdapter";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    create(entity: T) {
        //return ky.post('https://httpbin.org/post').then(_ => entity);
        return new Promise<T>(resolve => {
            // debugger;
            setTimeout(() => {
                debugger;
                resolve(entity)
            }, 5000)
        })
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
