import { EntityRequest } from "../manager/EntityRequest";
import { BehaviorSubject } from "rxjs";

export interface IManager<T> {
    initiateRequest(): void;
    stream: BehaviorSubject<T>;
    addToQueue(entity: EntityRequest): Promise<T>;
    initiateEntityRequest(entityRequest: EntityRequest): Promise<EntityRequest>
    create(entity: T): Promise<T>;
    update(): void;
    delete(): void;
}