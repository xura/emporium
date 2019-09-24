import {BehaviorSubject} from "rxjs";

const count = new BehaviorSubject(0);

const add = function() {
    let currentCount = count.getValue();
    currentCount++;
    count.next(currentCount);
};

window.emporium = { add, count };

export default { add, count };