import { Expect, TestCase, TestFixture, Test } from "alsatian";

@TestFixture("Example Test Fixture")
export class ExampleTestFixture {

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
    const num = preIteratedValue + 2;
    Expect(num).toBe(expected);
  }
}