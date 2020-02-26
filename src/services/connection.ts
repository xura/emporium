import { Connection as TypeOrmConnection } from 'typeorm';
import { injectable, singleton } from 'tsyringe';
import { IConnection } from '../interfaces';

@injectable()
@singleton()
export class Connection implements IConnection {
    constructor(private connection: () => TypeOrmConnection) { }
    connect = () => this.connection()
}