import yargs from "yargs";
import { getTestDirAnalysis } from "./src/jestAnalyzer.js";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).options({
  test_dir: {
    type: "string",
    demandOption: true,
    describe: "Test dir where the Jest tests are present",
  },
}).argv;

if (argv.test_dir) {
  getTestDirAnalysis(argv.test_dir);
}
