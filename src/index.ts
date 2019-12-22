import { container } from "tsyringe";
import { HttpBin } from "./adapters/HttpBin";
import { Emporium } from "./Emporium";

const initEmporium = () => {
    container.register("IRepository", {
        useClass: HttpBin
    });
};
alert('hey')

export { initEmporium, Emporium };


