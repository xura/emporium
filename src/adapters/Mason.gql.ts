import { injectable, inject } from "tsyringe";
import ky from "ky-universal";
import { IAdapter, IQueue } from "../interfaces";
import { EntityRequest, EntityRequestType } from '../manager/EntityRequest';
import { Chain } from '../../graphql-zeus';

@injectable()
export class Mason<T> implements IAdapter<T> {

    _chain = (async () => {
        // const c = Chain('http://localhost:2999/graphql');
        // debugger;
        // return await c.mutation({
        //     createEntity: [{
        //         input: {
        //             DateCreated: (new Date()).toISOString(),
        //             DateUpdated: (new Date()).toISOString(),
        //             Fields: JSON.stringify({ heythere: 123 }),
        //             Type: 1
        //         }
        //     }, {
        //         Type: true
        //     }]
        // })
    })()

    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<EntityRequest> {
        switch (entityRequest.RequestType) {
            case EntityRequestType.CREATE:
            default:
                return () => this.create(entityRequest)
        }
    }

    create = (entityRequest: EntityRequest) => {

        return Promise.resolve({} as EntityRequest)
    }

    find() {
        return ky.post('https://httpbin.org/get').then((_: any) => [])
    }

}
