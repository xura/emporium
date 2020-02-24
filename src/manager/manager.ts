import { Repository, Connection, ObjectType, ObjectLiteral, FindManyOptions, EntitySchema } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { IQueue } from "../interfaces/IQueue";
import { IRepository } from "../interfaces/IRepository";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";

export class Manager<T> {

    internalRepo: Repository<T>;
    requestRepo: Repository<EntityRequest>;

    constructor(
        connection: () => Connection,
        model: ObjectType<T>,
        @inject("IQueue") private queue: IQueue<T>,
        @inject("IRepository") private externalRepo: IRepository<T>
    ) {
        this.internalRepo = connection().getRepository(model)
        this.requestRepo = connection().getRepository(EntityRequest)
    }

    updateStatus = (entityRequest: EntityRequest, status: EntityRequestStatus) => {
        if (!entityRequest.id) {
            return Promise.reject('Trying to update an Entity Request with no Id');
        }

        return this.requestRepo.update(entityRequest.id, {
            RequestStatus: status
        });
    }

    initiateRequest = () => { }

    stream = () => { }

    addToQueue = (entity: EntityRequest) => {

    }

    persistTask = (entityRequest: EntityRequest) => {
        return this.requestRepo.save(entityRequest);
    }

    create = (entity: T) => {
        const entityRequest = {
            Type: typeof entity,
            RequestType: EntityRequestType.CREATE,
            RequestStatus: EntityRequestStatus.INITIATED,
            Payload: JSON.stringify(entity)
        };

        this.persistTask(entityRequest)
            .then(entityRequest => this.internalRepo.save(entity).then(_ => entityRequest))
            .then(entityRequest => this.updateStatus(entityRequest, EntityRequestStatus.PROCESSED_LOCALLY))
            .then(entityRequest => this.addToQueue(entityRequest, EntityRequestStatus.PROCESSED_LOCALLY));
    }

    update = () => { }

    delete = () => { }
}