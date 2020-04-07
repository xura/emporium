import { EntityRequest } from "../manager/EntityRequest";

export interface IAdapter<T> {
    create(entity: EntityRequest): Promise<EntityRequest>;
    find(): Promise<T[]>;
    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<EntityRequest>;
}
