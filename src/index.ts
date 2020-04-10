import { container } from "tsyringe";
import { Emporium } from "./Emporium";
import { Connection as TypeOrmConnection } from 'typeorm';
import { Manager } from "./manager";
import { EntityRequest } from "./manager/EntityRequest";
import ExternalResource from "./manager/ExternalResource";
import { Queue, Connection } from "./services";
import { Mason } from "./adapters/Mason.gql";

const initEmporium = (connection: () => TypeOrmConnection) => {
    container.register("IAdapter", { useClass: Mason });
    container.register("IQueue", { useClass: Queue }, { singleton: true });
    container.register("IManager", { useClass: Manager });
    container.register("IConnection", { useFactory: () => new Connection(connection) });
};

export { initEmporium, Emporium, EntityRequest, ExternalResource };