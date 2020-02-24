import { Observable, BehaviorSubject } from "rxjs";

export interface IQueue<T> {
    stream(): Promise<Observable<[number, T]>>;
    push(task: T): Promise<T>;
}
