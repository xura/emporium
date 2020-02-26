import { injectable } from "tsyringe";
import ky from "ky";
import { IAdapter } from "../interfaces/IAdapter";

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    create(entity: T) {
        debugger;
        return ky.post('https://httpbin.org/post').then(_ => entity);
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
