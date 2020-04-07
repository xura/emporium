import { injectable, inject } from "tsyringe";
import ky from "ky-universal";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';
import { createClient } from "../../mason/createClient";

@injectable()
export class Mason<T> implements IAdapter<T> {

    private _client = createClient({
        fetcher: ({ query, variables }, fetch, qs) =>
            fetch(`http://localhost:2999/graphql?${qs.stringify({ query, variables })}`).then(r => r.json())
    })

    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<EntityRequest> {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => this.create(entityRequest)
        }
    }

    create = (entityRequest: EntityRequest) => {
        debugger;
        return this._client.chain.mutation.createEntity({
            input: {
                Fields: entityRequest.Payload,
                Type: entityRequest.Type,
                DateCreated: new Date(),
                DateUpdated: new Date()
            }
        }).execute({
            _id: 1,
            Fields: 1,
            Type: 1
        }).then(result => {
            debugger;
            return result as unknown as EntityRequest;
        })
    }

    find() {
        return ky.post('https://httpbin.org/get').then((_: any) => [])
    }

}
