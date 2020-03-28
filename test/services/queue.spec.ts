import { Expect, TestCase, TestFixture, Test, Focus, Setup } from "alsatian";
import { Queue } from "../../src/services";
import { initEmporium } from "../../src";
import * as typeorm from 'typeorm';
import { stub, createStubInstance, createSandbox } from 'sinon'

const sandbox = createSandbox()
export const manager = sandbox.createStubInstance(typeorm.EntityManager)
export const connection = sandbox.createStubInstance(typeorm.Connection)
export const createConnection = stub(typeorm, 'createConnection').resolves(connection as unknown as typeorm.Connection)


@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Setup
  public async asyncSetup() {
    const cxn = await createConnection({
      type: "sqljs",
      location: "emporium",
      autoSave: true,
      entities: [],
      logging: ['query', 'schema'],
      synchronize: true
    })
    initEmporium(() => ({} as typeorm.Connection))
  }

  @TestCase(1, 2)
  @TestCase(4, 5)
  public exampleTest(preIteratedValue: number, expected: number) {
    const num = preIteratedValue + 1;
    Expect(num).toBe(expected);
  }

  @Focus
  @TestCase(1, 2)
  @TestCase(4, 5)
  @Test('another test')
  public exampleTest1(preIteratedValue: number, expected: number) {
    const queue = new Queue();
    Expect(true).toBe(true);
  }
}