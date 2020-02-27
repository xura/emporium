import { ObjectType, ObjectLiteral } from "typeorm";
import { autoInjectable } from "tsyringe";
import { IManager } from "./interfaces";
import { Manager } from "./manager";

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

    // stream = (): Promise<Observable<[number, T]>> => this.queue.stream();

    // streamAll = (): Promise<Observable<any>> =>
    //     this.stream().then(stream => stream.pipe(
    //         filter(task => task[0] === 1),
    //         map(_ => this.find())
    //     ));
}