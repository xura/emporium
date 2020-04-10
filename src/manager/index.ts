import { Repository, ObjectType, DeepPartial } from "typeorm";
import { inject, autoInjectable } from "tsyringe";
import { EntityRequest, EntityRequestStatus, EntityRequestType } from "./EntityRequest";
import { IManager, IConnection, IQueue } from "../interfaces";
import errors from '../shared/errors';
import { BehaviorSubject } from "rxjs";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
declare function assert(value: unknown): asserts value;

@autoInjectable()
export class Manager<T> implements IManager<T> {

    private _getInternalRepo: (() => Repository<T>) | undefined;
    private _getRequestRepo: (() => Repository<EntityRequest>) | undefined;

    private _markAsProcessedLocally = (entityRequest: EntityRequest) => {
        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IQueue']))

        if (!entityRequest.id)
            return Promise.reject("Trying to process an Entity without an Id")

        return this._getRequestRepo().update(entityRequest.id, {
            RequestStatus: EntityRequestStatus.PROCESSED_LOCALLY,
            Payload: JSON.stringify(entityRequest.Payload)
        }).then(() => entityRequest);
    }

    private _addToQueue = (entityRequest: EntityRequest) => {
        if (!this.queue)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

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
                (entity: any) => {
                    if (!this._getInternalRepo)
                        return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

                    this._getInternalRepo().update(entity.id, {
                        ExternalId: entity.ExternalId
                    } as QueryDeepPartialEntity<T>)
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
            (entity: any) => this._markAsProcessedLocally({
                ...entityRequest,
                Payload: JSON.stringify({
                    ...JSON.parse(entityRequest.Payload),
                    id: entity.id
                })
            });

        const emitProcessedLocallyEvent = (entity: EntityRequest) => {
            this.stream.next([0, JSON.parse(entity.Payload)])
            return Promise.resolve(entity);
        }

        return this._getInternalRepo().save(entity as DeepPartial<T>)
            .then(markEntityRequestAsProcessedLocally)
            .then(emitProcessedLocallyEvent)
            .then((er: EntityRequest) => this._addToQueue(er));
    }

    deleteAll = () => {
        this.connection?.connect().createQueryBuilder().delete().from(this.model.name).where("id != -1").execute()
        this.connection?.connect().createQueryBuilder().delete().from(EntityRequest).where("id != -1").execute()
    }

    findAll = async () => {
        if (!this._getInternalRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        if (!this._getRequestRepo)
            return Promise.reject(errors.INJECTION_ERROR(['IConnection']))

        return [
            await this._getInternalRepo().find(),
            await this._getRequestRepo().find()
        ]
    }

    update = () => { }

    delete = () => { }

}