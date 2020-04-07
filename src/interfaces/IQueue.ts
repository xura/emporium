import { Subject } from "rxjs";
import { EntityRequest } from "../manager/EntityRequest";

export interface IQueue<T> {
    push(entityRequest: EntityRequest): Promise<any>;
    processedExternally: Subject<T>;
}