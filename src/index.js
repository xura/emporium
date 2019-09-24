import {BehaviorSubject} from "rxjs";

class Emporium {
    count = new BehaviorSubject(0);

    constructor() {
        if (!!Emporium.instance) {
            return Emporium.instance;
        }

        Emporium.instance = this;

        return this;
    }

    add() {
        let currentCount = this.count.getValue();
        currentCount++;
        this.count.next(currentCount);
    }
}

window.emporium = new Emporium();

export default new Emporium();