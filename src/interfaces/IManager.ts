import { EntityRequest, EntityRequestStatus } from "../manager/EntityRequest";
import { UpdateResult } from "typeorm";

export interface IManager<T> {
    updateStatus(entityRequest: EntityRequest, status: EntityRequestStatus): Promise<UpdateResult>
    initiateRequest(): void;
    stream(): void;
    addToQueue(entity: EntityRequest): Promise<T>;
    initiateEntityRequest(entityRequest: EntityRequest): Promise<EntityRequest>
    create(entity: T): Promise<T>;
    update(): void;
    delete(): void;
}