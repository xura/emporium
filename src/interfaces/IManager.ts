import { EntityRequest } from "../manager/EntityRequest";
import { BehaviorSubject } from "rxjs";

export interface IManager<T> {
    stream: BehaviorSubject<[number, T]>;
    create(entity: T): Promise<T>;
    update(): void;
    delete(): void;
}