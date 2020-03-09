import { injectable, inject } from "tsyringe";
import ky from "ky";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    mapToExternalRequest<T>(entityRequest: EntityRequest): () => Promise<T> {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
                return () => ky.post('https://httpbin.org/status/500').then(_ => ({} as T))
            case EntityRequestType.UPDATE:
                return () => ky.put('https://httpbin.org/status/500').then(_ => ({} as T))
            case EntityRequestType.DELETE:
                return () => ky.delete('https://httpbin.org/status/500').then(_ => ({} as T))
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
