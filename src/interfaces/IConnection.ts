import { Connection } from 'typeorm';

export interface IConnection {
    connect: Connection
}