import { injectable, inject } from "tsyringe";
import ky from "ky";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest } from '../manager/EntityRequest';

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    mapToExternalRequest<T>(entityRequest: EntityRequest): () => Promise<T> {
        return () => {
            debugger;
            return ky.post('https://httpbin.org/status/500').then(_ => ({} as T))
        }
    }

    create = (entity: T) => {
        debugger;
        return ky.post('https://httpbin.org/status/500').then(_ => entity)
    }


    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
