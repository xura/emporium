import { Repository, ObjectType } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";
import { IManager, IAdapter, IConnection, IQueue } from "../interfaces";
import errors from '../shared/errors';

@autoInjectable()
export class Manager<T> implements IManager<T> {

    internalRepo?: Repository<T>;
    requestRepo?: Repository<EntityRequest>;

    constructor(
        model: ObjectType<T>,
        @inject("IQueue") private queue?: IQueue<T>,
        @inject("IAdapter") private externalRepo?: IAdapter<T>,
        @inject("IConnection") private connection?: IConnection
    ) {
        this.internalRepo = this.connection?.connect.getRepository(model)
        this.requestRepo = this.connection?.connect.getRepository(EntityRequest)
    }

    updateStatus = (entityRequest: EntityRequest, status: EntityRequestStatus) => {
        if (!entityRequest.id)
            return Promise.reject('Trying to update an Entity Request with no Id');

        if (!this.requestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this.requestRepo.update(entityRequest.id, {
            RequestStatus: status
        });
    }

    initiateRequest = () => { }

    stream = () => { }

    addToQueue = (entity: EntityRequest) => {
        if (!this.externalRepo || !this.queue)
            return Promise.reject(errors.INJECTION_ERROR(['IAdapter', 'IQueue']))

        return this.queue.push(this.externalRepo.create(JSON.parse(entity.Payload)));
    }

    initiateEntityRequest = (entityRequest: EntityRequest) => {
        if (!this.requestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this.requestRepo.save(entityRequest);
    }

    create = async (entity: T) => {
        if (!this.internalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        const initiateEntityRequest = {
            Type: typeof entity,
            RequestType: EntityRequestType.CREATE,
            RequestStatus: EntityRequestStatus.INITIATED,
            Payload: JSON.stringify(entity)
        };
        debugger;
        const entityRequest = await this.initiateEntityRequest(initiateEntityRequest)
        return this.internalRepo.save(entity)
            .then(_ => this.updateStatus(
                entityRequest, EntityRequestStatus.PROCESSED_LOCALLY)
            )
            .then(_ => this.addToQueue(entityRequest));
    }

    update = () => { }

    delete = () => { }

}