import { EntityRequest } from "../manager/EntityRequest";

export interface IAdapter<T> {
    create(entity: T): Promise<T>;
    find(): Promise<T[]>;
    mapToExternalRequest(entityRequest: EntityRequest): () => Promise<T>;
}
