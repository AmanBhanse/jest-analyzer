const generatePrintReport = (analysisObj, config) => {
  for (let testFileAnalysis of analysisObj) {
    const testFilePath = testFileAnalysis.testFilePath;
    const numberOfTestcases = testFileAnalysis.analysisResult.length;
    const analysisResult = testFileAnalysis.analysisResult;
    console.log(`+ Test file : ${testFilePath}`);
    if (numberOfTestcases < 1) {
      `${' '.repeat(3)}- No testcases found.`;
    } else {
      console.log(
        `${' '.repeat(3)}- Number of testcases : ${numberOfTestcases}`
      );

      console.log(`${' '.repeat(3)}+ Test-case analysis`);

      for (let singleTestcaseAnalysis of analysisResult) {
        console.log(
          `${' '.repeat(6)}+ Test description : ${
            singleTestcaseAnalysis.testDescription
          }`
        );
        console.log(
          `${' '.repeat(9)}- Is Assertion present? : ${
            singleTestcaseAnalysis.isExpectPresent
          }`
        );
      }
    }
  }
};

export const generateReport = (analysisObj, config) => {
  if (config.reportType == 'print') {
    generatePrintReport(analysisObj, config);
  }
};
