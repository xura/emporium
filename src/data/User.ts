import {BaseModel} from "./BaseModel";
import {inject, injectable} from "tsyringe";
import {IRepository} from "../interfaces/IRepository";

@injectable()
export class User extends BaseModel {
    constructor(@inject('IRepository') public repo: IRepository<User>) {
        super();
    }

    firstName: string = '';
}