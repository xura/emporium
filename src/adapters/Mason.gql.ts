import { injectable, inject } from "tsyringe";
import ky from "ky-universal";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';
import { Chain, $ } from '../../graphql-zeus';
import ExternalResource from "../manager/ExternalResource";

@injectable()
export class Mason<T extends ExternalResource> implements IAdapter<T> {

    private _gql = Chain('http://localhost:2999/graphql');

    mapToExternalRequest(entityRequest: EntityRequest) {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => this.create(entityRequest)
        }
    }

    create = (entityRequest: EntityRequest) => {
        const fields = JSON.parse(entityRequest.Payload);
        delete fields.id;
        return this._gql.mutation({
            createEntity: [
                { input: $`entity` },
                { _id: true }
            ]
        }, {
            entity: {
                Fields: fields,
                DateCreated: new Date(),
                DateUpdated: new Date(),
                Type: entityRequest.Type
            }
        }).then((entity: any) => ({
            ...entityRequest,
            Payload: JSON.stringify({
                ...JSON.parse(entityRequest.Payload),
                ExternalId: entity.createEntity._id
            })
        } as unknown as EntityRequest))
    }

    find() {
        return ky.post('https://httpbin.org/get').then((_: any) => [])
    }

}
