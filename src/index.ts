import { Achievement, Emporium } from "./data/Achievement";
import { BeforeInsert, createConnection, Entity } from "typeorm";


(async function () {
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

    const achievements = new Emporium<Achievement>(
        connection,
        Achievement
    );

    achievements.save({
        name: 'Hey there - no repo'
    })

    const a = await achievements.find();

    debugger;


    // const achievement = new Achievement();

    // achievement.name = 'Hey there';

    // // can we create a custom repo that sends off a IRepository BeforeSave command but doesnt save "repo" to the
    // // persistence store ?
    // // https://github.com/typeorm/typeorm-typedi-extensions
    // const achievementRepo = connection.getRepository<Achievement>(Achievement);

    // await achievementRepo.save(achievement);

    // const achievements = await achievementRepo.find();
    // debugger;

})();



