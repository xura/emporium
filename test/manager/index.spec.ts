import { TestCase, TestFixture, Test, Focus, Setup, Expect } from "alsatian";
import startConnection from '../connection';
import { Achievement } from "../Entity";
import { take } from 'rxjs/operators'
import { Manager } from "../../src/manager";
import { Observable, BehaviorSubject, Subject } from "rxjs";

@TestFixture("Manager Test Fixture")
export class ManagerTestFixture {

    @Setup
    public asyncSetup = async () => await startConnection();

    @Focus
    @Test('Creating an EntityRequest emits a new event to the Manager.stream BehaviorSubject')
    public async ManagerStreamTest() {
        const manager = new Manager(Achievement);

        const streamCallCount = await new Promise(resolve => {
            let count = 0;
            manager.stream.subscribe(entity => {
                count++;
            })

            manager.create({
                description: "Description",
                title: "Title"
            })

            setTimeout(() => {
                resolve(count)
            }, 300)
        })


        Expect(streamCallCount).toBe(3)
    }
}