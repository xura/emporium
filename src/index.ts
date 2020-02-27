import { container } from "tsyringe";
import { HttpBin } from "./adapters/HttpBin";
import { Emporium } from "./Emporium";
import { Connection as TypeOrmConnection } from 'typeorm';
import { Manager } from "./manager";
import { EntityRequest } from "./manager/EntityRequest";
import { Queue, Connection } from "./services";

const initEmporium = (connection: () => TypeOrmConnection) => {
    container.register("IAdapter", { useClass: HttpBin }, { singleton: true });
    container.register("IQueue", { useClass: Queue }, { singleton: true });
    container.register("IManager", { useClass: Manager });
    container.register("IConnection", { useFactory: () => new Connection(connection) });
};

export { initEmporium, Emporium, EntityRequest };