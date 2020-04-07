import { Repository, ObjectType } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";
import { IManager, IAdapter, IConnection, IQueue } from "../interfaces";
import errors from '../shared/errors';
import { BehaviorSubject } from "rxjs";
declare function assert(value: unknown): asserts value;

@autoInjectable()
export class Manager<T> implements IManager<T> {

    private _getInternalRepo: (() => Repository<T>) | undefined;
    private _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    private _markAsProcessedLocally = (entityRequest: EntityRequest) => {
        assert(entityRequest.id)
        assert(this._getRequestRepo)

        return this._getRequestRepo().update(entityRequest.id, {
            RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY
        }).then(() => JSON.parse(entityRequest.Payload));
    }

    private _addToQueue = (entityRequest: EntityRequest) => {
        if (!this.queue)
            return Promise.reject(errors.INJECTION_ERROR(['IQueue']))

        this.queue.push(entityRequest)

        return Promise.resolve(JSON.parse(entityRequest.Payload));
    }

    private _initiateEntityRequest = (entityRequest: EntityRequest) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return this._getRequestRepo().save(entityRequest);
    }

    constructor(
        private model: ObjectType<T>,
        @inject("IQueue") private queue?: IQueue<T>,
        @inject("IConnection") private connection?: IConnection
    ) {
        const cxn = this.connection;

        this.queue &&
            this.queue.processedExternally.subscribe(
                entity => {
                    debugger;
                    this.stream.next([1, entity])
                }
            )

        this._getInternalRepo =
            cxn && (() => cxn.connect().getRepository(model))

        this._getRequestRepo =
            cxn && (() => cxn.connect().getRepository(EntityRequest))
    }

    stream: BehaviorSubject<[number, T]> = new BehaviorSubject([0, {} as T]);

    create = async (entity: T) => {
        if (!this._getInternalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        const initiateEntityRequest = {
            Type: 1, //his.model.name,
            RequestType: EntityRequestType.CREATE,
            RequestStatus: EntityRequestStatus.INITIATED,
            Payload: JSON.stringify(entity),
            DateCreated: new Date()
        };

        const entityRequest =
            await this._initiateEntityRequest(initiateEntityRequest)

        const markEntityRequestAsProcessedLocally =
            () => this._markAsProcessedLocally(entityRequest);

        const emitProcessedLocallyEvent = (entity: T) => {
            this.stream.next([0, entity])
            return Promise.resolve(entity);
        }

        return this._getInternalRepo().save(entity)
            .then(markEntityRequestAsProcessedLocally)
            .then(emitProcessedLocallyEvent)
            .then(_ => this._addToQueue(entityRequest));
    }

    update = () => { }

    delete = () => { }

}