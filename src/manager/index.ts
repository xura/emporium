import { Repository, ObjectType } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";
import { IManager, IAdapter, IConnection, IQueue } from "../interfaces";
import errors from '../shared/errors';
import { BehaviorSubject } from "rxjs";

@autoInjectable()
export class Manager<T> implements IManager<T> {

    _getInternalRepo: (() => Repository<T>) | undefined;
    _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    constructor(
        private model: ObjectType<T>,
        @inject("IQueue") private queue?: IQueue<T>,
        @inject("IConnection") private connection?: IConnection
    ) {
        const cxn = this.connection;

        this._getInternalRepo =
            cxn && (() => cxn.connect().getRepository(model))

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    private _markAsProcessedLocally = (entityRequest: EntityRequest) => {
        if (!entityRequest.id)
            return Promise.reject('Trying to update an Entity Request with no Id');

        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this._getRequestRepo().update(entityRequest.id, {
            RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY
        });
    }

    initiateRequest = () => { }

    stream: BehaviorSubject<T> = new BehaviorSubject({} as T);

    addToQueue = (entityRequest: EntityRequest) => {
        if (!this.queue)
            return Promise.reject(errors.INJECTION_ERROR(['IQueue']))

        this.queue.push(entityRequest)

        return Promise.resolve(JSON.parse(entityRequest.Payload));
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
            Payload: JSON.stringify(entity),
            DateCreated: new Date()
        };

        const entityRequest =
            await this.initiateEntityRequest(initiateEntityRequest)

        const markEntityRequestAsProcessedLocally =
            () => this._markAsProcessedLocally(entityRequest);

        // TODO how do we get the newly created ID to return from internalRepo.save?
        // theoretically it could not be saved or we could be waiting for it to be saved
        // so in practice, we would need a way of updating records that havent been externally saved
        // that will eventually be reconciled
        // it may be possible to find if an EntityRequest has first been processed externally, if it hasnt,
        // edit the "insert" record that hasnt been processed externally yet
        return this._getInternalRepo().save(entity)
            .then(markEntityRequestAsProcessedLocally)
            .then(entity => this.stream.next(entity.raw))
            .then(_ => this.addToQueue(entityRequest));
    }

    update = () => { }

    delete = () => { }

}