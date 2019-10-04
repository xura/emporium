import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from "typeorm";
import {inject, injectable, container, autoInjectable} from "tsyringe";

interface IRepository {
    save(): Promise<any>;
}

@injectable()
class LocalStorage implements IRepository {
    save() {
        console.log('----local storaage save fired---')
        return Promise.resolve();
    }
}

@autoInjectable()
class OfflineFirst {

    constructor(@inject("IRepository") private repo?: IRepository) {}

    @BeforeInsert()
    async persist() {
        debugger;
        this.repo && await this.repo.save();
    }
}

container.register("IRepository", {
    useClass: LocalStorage
});


@Entity()
export class Achievement extends OfflineFirst {

    constructor() {
        super();
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string = '';
}