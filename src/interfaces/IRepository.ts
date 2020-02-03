import { Observable } from "rxjs";

export interface IRepository<T> {
    save(entity: T): Promise<T>;
    find(): Promise<T[]>;
    stream(): Promise<Observable<[number, T]>>;
}
