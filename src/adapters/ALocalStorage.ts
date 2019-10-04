import {IRepository} from "../interfaces/IRepository";
import {Observable, Subject} from "rxjs";
import localforage from 'localforage';
import {BaseModel} from "../data/BaseModel";
import {injectable} from "tsyringe";

@injectable()
export class ALocalStorage<T extends BaseModel> implements IRepository<T> {
    private _store: Subject<T> = new Subject<T>();

    add(entity: T): Promise<T> {
        return localforage.setItem(entity.id, entity)
            .then(savedEntity => {
                this._store.next(savedEntity);
                return savedEntity;
            });
    }

    get(id: string): Promise<T> {
        return localforage.getItem(id);
    }

    stream(): Observable<T> {
        return this._store;
    }

}