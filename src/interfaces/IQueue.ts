import { Observable } from "rxjs";
import { EntityRequest } from "../manager/EntityRequest";

export interface IQueue<T> {
    stream(): Promise<Observable<[number, T]>>;
    push(entityRequest: EntityRequest): Promise<any>;
}