import { Repository, Connection, ObjectType, getRepository } from "typeorm";
import { inject, autoInjectable, singleton } from "tsyringe";
import { Observable } from 'rxjs';
import { IRepository } from './interfaces/IRepository';

@autoInjectable()
@singleton()
export class Emporium<T> implements IRepository<T> {
    private _connectionName: string;
    private _model: ObjectType<T>;
    private _getRepo(): Promise<IRepository<T>> {
        if (!this.repo || !this._connectionName) {
            return Promise.reject("No Repo injected");
        }

        return Promise.resolve(this.repo);
    }
    get _entityRepo(): Repository<T> {
        return getRepository(this._model, this._connectionName);
    };

    constructor(
        connectionName: string,
        model: ObjectType<T>,
        @inject("IRepository") private repo?: IRepository<T>
    ) {
        this._connectionName = connectionName;
        this._model = model;
    }

    save(entity: T): Promise<T> {
        return this._getRepo()
            .then(repo => repo
                .save(entity)
                .then(result => this._entityRepo.save(entity)));
    }

    find(): Promise<T[]> {
        return this._getRepo()
            .then(repo => repo
                .find()
                .then((result => this._entityRepo.find())));
    }

    stream = (): Promise<Observable<T>> =>
        this._getRepo().then(repo => repo.stream());
}