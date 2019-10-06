import { container } from "tsyringe";
import { HttpBin } from "./adapters/HttpBin";
import { Emporium } from "../src/Emporium";

const initEmporium = () => {
    container.register("IRepository", {
        useClass: HttpBin
    });
}

export { initEmporium, Emporium };


