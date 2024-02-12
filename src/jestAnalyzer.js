import { error } from 'console';
import fs from 'fs';
import { simple } from 'acorn-walk';
import * as acorn from 'acorn';
import * as glob from 'glob';
import path from 'path';

export const parserJavascriptFile = (filePath) => {
  const code = fs.readFileSync(filePath, 'utf-8');
  let ast = null;
  try {
    ast = acorn.parse(code, { sourceType: 'module', ecmaVersion: 2021 });
  } catch (error) {
    console.error('Error parsing the code:', error);
  }
  return ast;
};

const _extractTestCaseFromDescribeFnCallbckBody = (describeFnCallbackBody) => {
  const testCaseNodeList = [];

  for (let node of describeFnCallbackBody) {
    //check if the node is expresion statement and it is function call
    if (
      node.type == 'ExpressionStatement' &&
      node.expression.type == 'CallExpression'
    ) {
      //Check if the called function is it or test
      if (
        node.expression.callee.name == 'it' ||
        node.expression.callee.name == 'test'
      ) {
        testCaseNodeList.push(node);
      }
    }
  }

  return testCaseNodeList;
};

const _getAnalysisOfItTestFn = (fnNode) => {
  if (
    fnNode.expression.callee.name != 'it' &&
    fnNode.expression.callee.name != 'test'
  ) {
    throw error;
  }

  const testDescription = fnNode.expression.arguments[0].value;
  const testCallbackfnNode = fnNode.expression.arguments[1];
  console.log(`${'  '.repeat(3)} - Analyzing := ${testDescription}`);
  let analysis = {
    testDescription,
    isExpectPresent: false,
  };

  simple(testCallbackfnNode, {
    CallExpression(node) {
      // Check if the function call is 'expect'
      if (node.callee.name === 'expect') {
        analysis.isExpectPresent = true;
      }
    },
  });

  if (analysis.isExpectPresent == true) {
    console.log(`${'  '.repeat(6)} - Assertion : Found`);
  } else {
    console.log(`${'  '.repeat(6)} - Assertion : Not Found!`);
  }

  return analysis;
};

const getAnalysisOnTestCaseNodes = (testCaseNodeList) => {
  const analysis = [];
  for (let node of testCaseNodeList) {
    // const calleeName = node.expression.callee.name;
    // console.log(`${"  ".repeat(3)} - Unit test = ${calleeName}`);
    const result = _getAnalysisOfItTestFn(node);
    analysis.push(result);
  }
  return analysis;
};

const getTestFileMeta = (ast) => {
  const allTestCaseAnlysis = [];

  if (ast.hasOwnProperty('body')) {
    const body = ast.body;
    for (let node of body) {
      //Check for expresion statements which is getting called , i.e function call
      if (
        node.hasOwnProperty('type') &&
        node.type == 'ExpressionStatement' &&
        node.expression.type == 'CallExpression'
      ) {
        //Now check if the called function is "describe" or not
        if (node.expression.callee.name == 'describe') {
          console.log('- Describe block found');
          let suite_description = null;
          let describeFnCallbackBody = null;

          //Logic to get Describe title
          if (node.expression.arguments[0].type == 'Literal') {
            suite_description = node.expression.arguments[0].value;
          }
          console.log(`${'  '.repeat(3)} - Description : ${suite_description}`);

          //Logic to get callback called at describe function
          if (node.expression.arguments[1].type == 'FunctionExpression') {
            describeFnCallbackBody = node.expression.arguments[1].body.body;

            let testcaseNodeList = _extractTestCaseFromDescribeFnCallbckBody(
              describeFnCallbackBody
            );

            let testCasesInsideDescribeFnAnalysis =
              getAnalysisOnTestCaseNodes(testcaseNodeList);

            allTestCaseAnlysis.push(...testCasesInsideDescribeFnAnalysis);
          }
        } //describe check ends

        //Now check if the called function is "it"/"test" or not
        if (
          node.expression.callee.name == 'it' ||
          node.expression.callee.name == 'test'
        ) {
          console.log('- it/test block found');
          const singleTestCaseAnalysisResult = _getAnalysisOfItTestFn(node);
          allTestCaseAnlysis.push(singleTestCaseAnalysisResult);
        }
      }
    }
  }

  return allTestCaseAnlysis;
};

const write_ast_to_out_dir = (ast) => {
  const out_file = 'D:/programming/Scripts/out/ast.json';
  const jsonString = JSON.stringify(ast, null, 2);
  fs.writeFile(out_file, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('JSON data has been written to', out_file);
    }
  });
};

export const getJestFileAnalysis = (testFilePath) => {
  const ast = parserJavascriptFile(testFilePath);
  const analysisResult = getTestFileMeta(ast);
  return {
    testFilePath,
    numberOfTestcases: analysisResult.length,
    analysisResult,
  };
};

const isDir = (dirPath) => {
  // returns : 1 = it is directory, 0 if it is not, -1 when path not exist
  try {
    const stats = fs.statSync(test_dir);
    if (stats.isDirectory() != true) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return -1;
  }
};

export const getTestDirAnalysis = (test_dir) => {
  //Check test_dir validity
  if (isDir(test_dir) != 1) {
    console.error(`ERRROR : Invalid path ${test_dir}`);
  }

  let allTestFilesAnalysis = [];
  let glob_test_file_pattern = path.join(test_dir, '*test.js');
  let forwardSlashPath = glob_test_file_pattern.replace(/\\/g, '/'); //Glob is compatible with forward slash paths only
  const test_files = glob.glob.sync(forwardSlashPath);

  for (let test_file_path of test_files) {
    console.log(`- Analyzing test file : ${test_file_path}`);
    let singleTestFileAnalysis = getJestFileAnalysis(test_file_path);
    allTestFilesAnalysis.push(singleTestFileAnalysis);
  }
};
