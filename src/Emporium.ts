import { Repository, Connection, ObjectType } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { Observable } from 'rxjs';
import { IRepository } from './interfaces/IRepository';


@autoInjectable()
export class Emporium<T> implements IRepository<T> {
    private _entityRepo: Repository<T>;
    private _getRepo(): Promise<IRepository<T>> {
        if (!this.repo) {
            return Promise.reject("No Repo injected");
        }

        return Promise.resolve(this.repo);
    }

    constructor(
        connection: Connection,
        model: ObjectType<T>,
        @inject("IRepository") private repo?: IRepository<T>
    ) {
        this._entityRepo = connection.getRepository(model);
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