import {BaseModel} from "./BaseModel";
import {ALocalStorage} from "../adapters/ALocalStorage";
import {inject, injectable} from "tsyringe";
import {IRepository} from "../interfaces/IRepository";

@injectable()
export class Achievement extends BaseModel {
    constructor(@inject('IRepository') public repo: IRepository<Achievement>) {
        super();
    }

    name: string = '';
}