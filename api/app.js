const http = require("http");
const path = require("path");

const express = require("express");

const testController = require("./test/test-controller");
const testResultController = require("./test/result/test-result-controller");
const testStudentQuestionController = require("./test/student/question/test-student-question-controller");
const testStudentQuestionAnswerController = require("./test/student/question/answer/test-student-question-answer-controller");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "app", "dist")));

testController.init(app);
testResultController.init(app);
testStudentQuestionController.init(app);
testStudentQuestionAnswerController.init(app);

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "app", "dist", "index.html"));
});

let server = null;

module.exports.listen = (port) =>
  new Promise((resolve) => {
    console.log(`Starting API server on port ${port}`);
    server = http.createServer(app);
    server.listen(port);
    resolve();
  });

module.exports.close = () => new Promise((resolve) => server.close(resolve));
