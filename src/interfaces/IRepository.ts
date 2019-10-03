import {Observable} from "rxjs";

export interface IRepository<T> {
    add(entity: T): Promise<T>;
    get(id: string): Promise<T>;
    stream(): Observable<T>;
}