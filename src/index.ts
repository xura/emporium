import "reflect-metadata";
import {container, singleton} from "tsyringe";
import {Achievement} from "./data/Achievement";

const containers = {
    achievements: {
        resolve: () => container.resolve(Achievement)
    }
};

@singleton()
export class Emporium {
    [key: string]: {}

    constructor() {
        for (let [container, {resolve}] of Object.entries(containers)) {
            this[container] = resolve();
        }
    }
}

// @ts-ignore
window.emp = new Emporium();