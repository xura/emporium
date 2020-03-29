import { injectable, inject } from "tsyringe";
import ky from "ky-universal";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<T> {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => ky.post('https://httpbin.org/status/200').then((response: Response) => {
                    return response.json()
                }).catch(e => {
                    debugger
                })
        }
    }

    create = (entity: T) => {
        return ky.post('https://httpbin.org/status/500').then(_ => entity)
    }

    find() {
        return ky.post('https://httpbin.org/get').then(_ => []);
    }

}
