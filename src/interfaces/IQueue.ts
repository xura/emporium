import { Observable, BehaviorSubject } from "rxjs";
import { EntityRequest } from "../manager/EntityRequest";

export interface IQueue<T> {
    push(entityRequest: EntityRequest): Promise<any>;
    processedExternally: BehaviorSubject<T>;
}