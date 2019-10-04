import "reflect-metadata";
import {container, singleton} from "tsyringe";
import {Achievement} from "./data/Achievement";
import {ALocalStorage} from "./adapters/ALocalStorage";
import {User} from "./data/User";

container.register("IRepository", {
    useClass: ALocalStorage
});

const containers = {
    achievements: container.resolve(Achievement),
    users: container.resolve(User)
};

containers.achievements.repo.stream().subscribe(_ =>
    (document.getElementById("achievements") as any).textContent = _.id);

containers.users.repo.stream().subscribe(_ =>
    (document.getElementById("users") as any).textContent = _.firstName);

// @ts-ignore
window.emp = containers;