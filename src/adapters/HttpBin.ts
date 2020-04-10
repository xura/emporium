import { injectable } from "tsyringe";
import ky from "ky-universal";
import { IAdapter } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';
import ExternalResource from '../manager/ExternalResource';

@injectable()
export class HttpBin<T extends ExternalResource> implements IAdapter<T> {

    mapToExternalRequest(entityRequest: EntityRequest) {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => this.create(entityRequest);
        }
    }

    create = (entityRequest: EntityRequest) => {
        return ky.post('https://httpbin.org/status/500').then((_: any) => entityRequest as unknown as EntityRequest)
    }

    find() {
        return ky.post('https://httpbin.org/get').then((_: any) => [])
    }

}
