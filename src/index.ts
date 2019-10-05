import { Emporium } from './Emporium';
import { Achievement } from "./data/Achievement";
import { createConnection } from "typeorm";
import { container } from "tsyringe";
import { HttpBin } from "./adapters/HttpBin";


const emp = {
    init: new Promise(async function (resolve) {
        const connection = await createConnection({
            type: "sqljs",
            location: "emporium",
            autoSave: true,
            entities: [
                Achievement
            ],
            logging: ['query', 'schema'],
            synchronize: true
        });

        const models = [
            Achievement
        ];

        container.register("IRepository", {
            useClass: HttpBin
        });

        const achievements = new Emporium<Achievement>(
            connection,
            Achievement
        );

        achievements.stream()
            .then(store =>
                store.subscribe(achievement =>
                    (document.getElementById('achievements') as any).textContent = achievement.name));

        achievements.save({
            name: `Hey there - no repo ${Math.random()}`
        });

        const repos = { achievements };

        // @ts-ignore
        window.emp = repos;

        resolve(repos);
    })
};


export { emp };


