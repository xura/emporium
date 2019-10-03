import "reflect-metadata";
import {container, singleton} from "tsyringe";
import {Achievement} from "./data/Achievement";
import {Container} from "inversify";
import {IRepository} from "./interfaces/IRepository";

export const TYPES = {
    Repository: Symbol("Repository")
};


const container = new Container();
container.bind<IRepository>(TYPES.Repository).to()