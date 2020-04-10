import { Column, PrimaryGeneratedColumn } from "typeorm";

export default abstract class {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    ExternalId: string = '';
}