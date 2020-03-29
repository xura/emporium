import { Entity, Column, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';

export enum EntityRequestStatus {
    INITIATED,
    PROCESSED_LOCALLY,
    PROCESSED_EXTERNALLY
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
    Payload: any = {};

    @Column({ type: 'datetime', nullable: true })
    DateCreated?: Date;
}
