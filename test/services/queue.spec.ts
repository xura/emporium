import { Expect, TestCase, TestFixture, Test, Focus, Setup } from "alsatian";
import { Queue } from "../../src/services";
import startConnection from '../connection';

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

  @Setup
  public asyncSetup = async () => await startConnection();

  @TestCase(1, 2)
  @TestCase(4, 5)
  public exampleTest(preIteratedValue: number, expected: number) {
    const num = preIteratedValue + 1;
    Expect(num).toBe(expected);
  }

  @TestCase(1, 2)
  @TestCase(4, 5)
  @Test('another test')
  public exampleTest1(preIteratedValue: number, expected: number) {
    const queue = new Queue();
    Expect(true).toBe(true);
  }
}