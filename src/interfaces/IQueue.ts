import { Observable } from "rxjs";
import { EntityRequest } from "../manager/EntityRequest";

export interface IQueue<T> {
    stream: Observable<[number, T]>;
    push(entityRequest: EntityRequest): Promise<any>;
}