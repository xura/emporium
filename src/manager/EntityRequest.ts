import { Entity, Column, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';


export enum EntityRequestStatus {
    INITIATED,
    PROCESSED_LOCALLY,
    QUEUED,
    PROCESSED_EXTERNALLY,
    IN_SYNC
}

export enum EntityRequestType {
    CREATE,
    UPDATE,
    DELETE
}

@Entity()
export class EntityRequest implements ObjectLiteral {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    Type: string = '';

    @Column()
    RequestStatus: EntityRequestStatus = EntityRequestStatus.INITIATED;

    @Column()
    RequestType: EntityRequestType = EntityRequestType.CREATE;

    @Column()
    Payload: string = '';
}
