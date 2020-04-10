import { EntityRequest } from "../manager/EntityRequest";
import ExternalResource from "../manager/ExternalResource";

export interface IAdapter<T extends ExternalResource> {
    create(entity: EntityRequest): Promise<EntityRequest>;
    find(): Promise<T[]>;
    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<EntityRequest>;
}
