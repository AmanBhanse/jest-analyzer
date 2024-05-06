import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

const generatePrintReport = (analysisObj, config) => {
  for (let testFileAnalysis of analysisObj) {
    const testFilePath = testFileAnalysis.testFilePath;
    const numberOfTestcases = testFileAnalysis.assertionAnalysisResult.length;
    const assertionAnalysisResult = testFileAnalysis.assertionAnalysisResult;
    console.log(`+ Test file : ${testFilePath}`);
    if (numberOfTestcases < 1) {
      `${' '.repeat(3)}- No testcases found.`;
    } else {
      console.log(
        `${' '.repeat(3)}- Number of testcases : ${numberOfTestcases}`
      );

      console.log(`${' '.repeat(3)}+ Test-case analysis`);

      for (let singleTestcaseAnalysis of assertionAnalysisResult) {
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

const generateJsonReport = (analysisObj, config) => {
  const jsonString = JSON.stringify(analysisObj, null, 2);
  const outDir = config.outDir;
  const outFile = path.join(outDir, 'jest_analysis.json');

  fs.writeFile(outFile, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.debug('JSON data has been written to', outFile);
    }
  });
};

const generateHtmlReport = (analysisObj, config) => {
  let totalNumberOfTestcasesInAllFile = 0;
  let totalNumberOfTestcasesWithoutAssertionInAllFile = 0;
  let tableRows = [];
  // create HTML table and get total test-case and test-cases without assertion
  for (let fileAnalysis of analysisObj) {
    let testcasesCountInsideFile = fileAnalysis.assertionAnalysisResult.length;
    let testcasesWithoutAssertion = 0;

    for (let testcaseAnalysis of fileAnalysis.assertionAnalysisResult) {
      if (!testcaseAnalysis.isExpectPresent) {
        testcasesWithoutAssertion += 1;
      }

      tableRows.push(`
        <tr>
            <td>
                ${path.basename(fileAnalysis.testFilePath)}
            </td>
            <td>
                ${testcaseAnalysis.testDescription}
            </td>
            <td>
                ${testcaseAnalysis.isExpectPresent}
            </td>
        </tr>
        `);
    }

    //Add the count to total
    totalNumberOfTestcasesInAllFile += testcasesCountInsideFile;
    totalNumberOfTestcasesWithoutAssertionInAllFile +=
      testcasesWithoutAssertion;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dynamic HTML Table</title>
    </head>
    <style>
        /* Table style */
        table {
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
        }

        /* Table header style */
        th {
            background-color: #f2f2f2;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        /* Table data style */
        td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        /* Alternate row background color */
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        /* Hover effect */
        tr:hover {
            background-color: #ddd;
        }
    </style>
    <body>

    <div>
    <h2>
        Total number of test-case : ${totalNumberOfTestcasesInAllFile}
    </h2>
    <h2>
        Total number of test-case without assertion : ${totalNumberOfTestcasesWithoutAssertionInAllFile}
    </h2>
    </div>

    <div>
        <table>
        <tr>
            <th>File Name</th>
            <th>Testcase</th>
            <th>Has Assertions?</th>
        </tr>
        ${tableRows.join('')}
        </table>
    </div>
        
    </body>
    </html>
    
    `;

  const outDir = config.outDir;
  const outFile = path.join(outDir, 'jest_analysis.html');

  fs.writeFile(outFile, htmlContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.debug('Analysis data has been written to', outFile);
    }
  });
};

const generateExcelReport = async (analysisObj, config) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Analysis');

  // Define columns
  worksheet.columns = [
    { header: 'File Name', key: 'fileName' },
    { header: 'Testcase', key: 'testcase' },
    { header: 'Has Assertions?', key: 'hasAssertions' },
  ];

  // Add rows
  for (let fileAnalysis of analysisObj) {
    for (let testcaseAnalysis of fileAnalysis.assertionAnalysisResult) {
      worksheet.addRow({
        fileName: path.basename(fileAnalysis.testFilePath),
        testcase: testcaseAnalysis.testDescription,
        hasAssertions: testcaseAnalysis.isExpectPresent,
      });
    }
  }

  const outDir = config.outDir;
  const outFile = path.join(outDir, 'jest_analysis.xlsx');

  // Write to file
  await workbook.xlsx.writeFile(outFile);
  console.debug('Excel data has been written to', outFile);
};


export const generateReport = (analysisObj, config) => {
  if (config.reportType == 'print') {
    generatePrintReport(analysisObj, config);
  }

  if (config.reportType == 'json') {
    generateJsonReport(analysisObj, config);
  }

  if (config.reportType == 'html') {
    generateHtmlReport(analysisObj, config);
  }

  if (config.reportType == 'excel') {
    generateExcelReport(analysisObj, config);
  }
};
