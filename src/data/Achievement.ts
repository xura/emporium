import { Entity, Column, PrimaryGeneratedColumn, Repository, Connection, ObjectType } from "typeorm";
import { inject, injectable, container, autoInjectable, singleton } from "tsyringe";
import { Observable, Subject } from 'rxjs';
import { AsyncQueue, queue } from 'async';
import { default as ky } from 'ky';


@Entity()
export class Achievement {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name: string = '';
}
