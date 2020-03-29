import { initEmporium } from "../src"
import { createSandbox, stub } from "sinon"
import * as typeorm from 'typeorm'
import { Achievement } from "./Entity"
import ky from 'ky-universal';


const sandbox = createSandbox()
export const manager = sandbox.createStubInstance(typeorm.EntityManager)
export const connection = sandbox.createStubInstance(typeorm.Connection)
export const createConnection = stub(typeorm, 'createConnection').resolves({
    getRepository: () => ({
        save: (e: any) => Promise.resolve({
            ...e,
            id: 'new-id',
        }),
        update: (e: any) => Promise.resolve(e),
        find: () => Promise.resolve([])
    } as unknown as typeorm.Repository<Achievement>)
} as unknown as typeorm.Connection);

sandbox.stub(ky, 'post').resolves({
    json: () => Promise.resolve({
        id: 'new-id'
    })
} as unknown as Response)

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