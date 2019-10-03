import {BaseModel} from "./BaseModel";
import {ALocalStorage} from "../adapters/ALocalStorage";
import { injectable, inject } from "inversify";
import {TYPES} from "../index";

@injectable()
export class Achievement extends BaseModel {
    constructor(@inject(TYPES.Repository) public repo: ALocalStorage<Achievement>) {
        super();
    }

    name: string = '';
}