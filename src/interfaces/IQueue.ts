import { Observable } from "rxjs";

export interface IQueue<T> {
    stream(): Promise<Observable<[number, T]>>;
    push(task: Promise<T>): Promise<any>;
}
