import { Repository, Connection, ObjectType, ObjectLiteral, FindManyOptions } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IRepository } from './interfaces/IRepository';
import { IQueue } from "./interfaces/IQueue";

@autoInjectable()
export class Emporium<T extends ObjectLiteral> implements IRepository<T> {
    private readonly _connection: () => Connection;
    private readonly _model: ObjectType<T>;

    private get _entityRepo(): Repository<T> {
        return this._connection().getRepository(this._model);
    };

    constructor(
        connection: () => Connection,
        model: ObjectType<T>,
        @inject("IQueue") private queue: IQueue<T>,
        @inject("IRepository") private repo: IRepository<T>
    ) {
        this._connection = connection;
        this._model = model;
    }

    save = (entity: T): Promise<T> => {
        return this.queue.push(entity)
            .then(result => this._entityRepo.save(entity))
            .then(_ => this.repo.save(entity))
    }
    //

    find = (findOptions = { order: { id: 'DESC' } } as FindManyOptions): Promise<T[]> =>
        this.repo.find().then((result => this._entityRepo.find(findOptions)));

    stream = (): Promise<Observable<[number, T]>> => this.queue.stream();

    streamAll = (): Promise<Observable<any>> =>
        this.stream().then(stream => stream.pipe(
            filter(task => task[0] === 1),
            map(_ => this.find())
        ));
}