import {BaseModel} from "./BaseModel";
import {ALocalStorage} from "../adapters/ALocalStorage";
import {injectable} from "tsyringe";

@injectable()
export class Achievement extends BaseModel {
    constructor(private _repo: ALocalStorage<Achievement>) {
        super();
    }

    name: string = '';
}