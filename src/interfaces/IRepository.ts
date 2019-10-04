import {Observable} from "rxjs";

export interface IRepository<T> {
    add(entity: Omit<T, 'repo'>): Promise<Omit<T, 'repo'>>;
    get(id: string): Promise<Omit<T, 'repo'>>;
    stream(): Observable<Omit<T, 'repo'>>;
}