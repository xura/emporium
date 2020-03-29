import { initEmporium } from "../src"
import { createSandbox, stub } from "sinon"
import * as typeorm from 'typeorm'
import { Achievement } from "./Entity"

const sandbox = createSandbox()
export const manager = sandbox.createStubInstance(typeorm.EntityManager)
export const connection = sandbox.createStubInstance(typeorm.Connection)
export const createConnection = stub(typeorm, 'createConnection').resolves(connection as unknown as typeorm.Connection)

export default async () => {
    const cxn = await createConnection({
        type: "sqljs",
        location: "emporium",
        autoSave: true,
        entities: [
            Achievement
        ],
        logging: ['query', 'schema'],
        synchronize: true
    })
    initEmporium(() => cxn)
}