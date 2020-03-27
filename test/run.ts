import { TestSet, TestRunner } from "alsatian";
import { TapBark } from "tap-bark";
import path from 'path';

// create test set
const testSet = TestSet.create();
const tests = path.resolve(__dirname, "**/*.spec.ts");

// add your tests
testSet.addTestsFromFiles(tests);

// create a test runner
const testRunner = new TestRunner();

// setup the output
testRunner.outputStream
          // this will use alsatian's default output if you remove this
          // you'll get TAP or you can add your favourite TAP reporter in it's place
          .pipe(TapBark.create().getPipeable()) 
          // pipe to the console
          .pipe(process.stdout);

// run the test set
testRunner.run(testSet)
          // this will be called after all tests have been run
        //   .then((results) => console.log(results))
        //   // this will be called if there was a problem
        //   .catch((error) => console.error(error));