import { ObjectID, Column, Entity } from "typeorm";

@Entity()
export default abstract class {
    @Column("text")
    ExternalId?: ObjectID;
}