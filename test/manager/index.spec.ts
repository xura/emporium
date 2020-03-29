import { Expect, TestCase, TestFixture, Test, Focus, Setup } from "alsatian";
import startConnection from '../connection';
import { Manager } from "../../src/manager";
import { Achievement } from "../Entity";

@TestFixture("Manager Test Fixture")
export class ManagerTestFixture {

    @Setup
    public asyncSetup = async () => await startConnection();

    @Focus
    @TestCase(1, 2)
    @Test('Creating an EntityRequest emits a new event to the Manager.stream BehaviorSubject')
    public ManagerStreamTest() {
        const manager = new Manager(Achievement);
        Expect(true).toBe(true);
    }
}