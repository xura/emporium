import { Repository, Connection, ObjectType, ObjectLiteral, FindManyOptions } from "typeorm";
import { inject, autoInjectable, singleton } from "tsyringe";
import { Observable, of } from 'rxjs';
import { filter, switchMap, flatMap, map, mergeMap } from 'rxjs/operators';
import { IRepository } from './interfaces/IRepository';

@autoInjectable()
export class Emporium<T extends ObjectLiteral> implements IRepository<T> {
    private readonly _connection: () => Connection;
    private readonly _model: ObjectType<T>;

    private _getRepo(): Promise<IRepository<T>> {
        if (!this.repo || !this._connection) {
            return Promise.reject("No Repo injected");
        }

        return Promise.resolve(this.repo);
    }
    private get _entityRepo(): Repository<T> {
        return this._connection().getRepository(this._model);
    };

    constructor(
        connection: () => Connection,
        model: ObjectType<T>,
        @inject("IRepository") private repo?: IRepository<T>
    ) {
        this._connection = connection;
        this._model = model;
    }

    save = (entity: T): Promise<T> =>
        this._getRepo()
            .then(repo => repo
                .save(entity)
                .then(result => this._entityRepo.save(entity)))

    find = (findOptions = { order: { id: 'DESC' } } as FindManyOptions): Promise<T[]> =>
        this._getRepo()
            .then(repo => repo
                .find()
                .then((result => this._entityRepo.find(findOptions))));

    stream = (): Promise<Observable<[number, T]>> =>
        this._getRepo().then(repo => repo.stream());

    streamAll = (): Promise<Observable<any>> =>
        this._getRepo()
            .then(repo => repo.stream())
            .then(stream => stream.pipe(
                filter(task => task[0] === 1),
                map(_ => this.find())
            ));
}