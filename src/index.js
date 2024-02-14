import yargs from "yargs";
import { getTestDirAnalysis } from "./jestAnalyzer.js";
import { hideBin } from "yargs/helpers";
import { isDir } from "./commonUtils.js";

const main = () => {
  const argv = yargs(hideBin(process.argv)).options({
    test_dir: {
      type: "string",
      demandOption: true,
      describe: "Test dir where the Jest tests are present",
    },
    report_type: {
      describe: "type of report",
      choices: ["html", "json"],
      type: "string",
    },
    report_out: {
      describe: "directory where script will generate the report",
      type: "string",
    },
  }).argv;

  // Check if report_type is provided, and if so, ensure report_out is also provided
  if (argv.report_type && !argv.report_out) {
    console.error(
      "If report_type is provided, report_out must also be provided."
    );
    process.exit(1); // Exit with error code
  } else if (argv.report_type && argv.report_out) {
    const report_out = argv.report_out;
    if (isDir(report_out) != 1) {
      console.error(`Invalid path ${report_out}`);
      process.exit(1); // Exit with error code
    }
  }

  if (argv.test_dir) {
    const reportConfig = {
      reportType: argv.report_type,
      outDir: argv.report_out,
    };
    getTestDirAnalysis(argv.test_dir, reportConfig);
  }
};

main();
