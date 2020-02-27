import { Repository, ObjectType } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";
import { IManager, IAdapter, IConnection, IQueue } from "../interfaces";
import errors from '../shared/errors';

@autoInjectable()
export class Manager<T> implements IManager<T> {

    _getInternalRepo: (() => Repository<T>) | undefined;
    _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    constructor(
        private model: ObjectType<T>,
        @inject("IQueue") private queue?: IQueue<T>,
        @inject("IAdapter") private externalRepo?: IAdapter<T>,
        @inject("IConnection") private connection?: IConnection
    ) {
        const cxn = this.connection;

        this._getInternalRepo =
            cxn && (() => cxn.connect().getRepository(model))

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    updateStatus = (entityRequest: EntityRequest, status: EntityRequestStatus) => {
        if (!entityRequest.id)
            return Promise.reject('Trying to update an Entity Request with no Id');

        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this._getRequestRepo().update(entityRequest.id, {
            RequestStatus: status
        });
    }

    initiateRequest = () => { }

    stream = () => { }

    addToQueue = (entity: EntityRequest) => {
        if (!this.externalRepo || !this.queue)
            return Promise.reject(errors.INJECTION_ERROR(['IAdapter', 'IQueue']))

        return this.queue.push(
            this.externalRepo.create(JSON.parse(entity.Payload))
        );
    }

    initiateEntityRequest = (entityRequest: EntityRequest) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this._getRequestRepo().save(entityRequest);
    }

    create = async (entity: T) => {
        if (!this._getInternalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        const initiateEntityRequest = {
            Type: this.model.name,
            RequestType: EntityRequestType.CREATE,
            RequestStatus: EntityRequestStatus.INITIATED,
            Payload: JSON.stringify(entity)
        };

        const entityRequest =
            await this.initiateEntityRequest(initiateEntityRequest)

        return this._getInternalRepo().save(entity)
            .then(_ => this.updateStatus(
                entityRequest, EntityRequestStatus.PROCESSED_LOCALLY)
            )
            .then(_ => this.addToQueue(entityRequest));
    }

    update = () => { }

    delete = () => { }

}