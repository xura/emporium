import { injectable, inject } from "tsyringe";
import ky from "ky-universal";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';

@injectable()
export class HttpBin<T> implements IAdapter<T> {

    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<EntityRequest> {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => ky.post('https://httpbin.org/status/200').then((response: Response) => {
                    return response.json()
                })
        }
    }

    create = (entityRequest: EntityRequest) => {
        return ky.post('https://httpbin.org/status/500').then((_: any) => entityRequest as unknown as EntityRequest)
    }

    find() {
        return ky.post('https://httpbin.org/get').then((_: any) => [])
    }

}
