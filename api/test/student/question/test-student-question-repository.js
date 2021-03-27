const { db } = require("../../../db");

const COLLECTION = "test-student-questions";

module.exports.findByTestIdAndStudentId = (testId, studentId) =>
  db().collection(COLLECTION).findOne({ testId, studentId });

module.exports.findByTestId = (testId) =>
  db().collection(COLLECTION).find({ testId }).toArray();

module.exports.save = async (questions) =>
  (await db().collection(COLLECTION).insertOne(questions)).ops[0];
