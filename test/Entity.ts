import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import ExternalResource from './ExternalResource';

@Entity()
export class Achievement extends ExternalResource {

    @Column()
    title: string = '';

    @Column({
        default: ''
    })
    description: string = '';
}