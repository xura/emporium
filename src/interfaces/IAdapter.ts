import { Observable } from "rxjs";

export interface IAdapter<T> {
    save(entity: T): Promise<T>;
    find(): Promise<T[]>;
}
