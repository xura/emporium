import { ObjectType, ObjectLiteral } from "typeorm";
import { autoInjectable } from "tsyringe";
import { IManager } from "./interfaces";
import { Manager } from "./manager";
import { Observable, of } from "rxjs";

@autoInjectable()
export class Emporium<T extends ObjectLiteral> {

    private _manager: IManager<T>;

    constructor(model: ObjectType<T>) {
        this._manager = new Manager(model)
    }

    create = (entity: T): Promise<T> | undefined =>
        this._manager.create(entity);

    // find = (findOptions = { order: { id: 'DESC' } } as FindManyOptions): Promise<T[]> =>
    //     this.repo.find().then((result => this._entityRepo.find(findOptions)));

    stream = (): Promise<Observable<any>> => Promise.resolve(of())

    streamAll = (): Promise<Observable<any>> => Promise.resolve(of(Promise.resolve()))
}