import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Repository, EntitySchema, EntityRepository, getCustomRepository, Connection, getRepository, ObjectType } from "typeorm";
import { inject, injectable, container, autoInjectable } from "tsyringe";
import { Observable } from 'rxjs';

interface IRepository {
    save(): Promise<any>;
    find(): Promise<any>;
}

@injectable()
class LocalStorage implements IRepository {
    save() {
        console.log('----local storaage save fired---')
        return Promise.resolve();
    }

    find() {
        return Promise.resolve();
    }
}

container.register("IRepository", {
    useClass: LocalStorage
});

@autoInjectable()
export class Emporium<T> {
    public entityRepo: Repository<T>;

    constructor(
        connection: Connection,
        model: ObjectType<T>,
        @inject("IRepository") private repo?: IRepository
    ) {
        this.entityRepo = connection.getRepository(model);
    }

    private getRepo(): Promise<IRepository> {
        if (!this.repo) {
            return Promise.reject("No Repo injected");
        }

        return Promise.resolve(this.repo);
    }

    save(entity: T): Promise<T> {
        return this.getRepo()
            .then(repo => repo.save().then((_: any) => {
                return this.entityRepo.save<T>(entity);
            }));
    }

    find(): Promise<T[]> {
        return this.getRepo()
            .then(repo => repo.find().then((_: any) => {
                return this.entityRepo.find();
            }));
    }
}

@Entity()
export class Achievement {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string = '';
}
