const { db } = require('../../../db');

module.exports.findByTestIdAndStudentId =
    async (testId, studentId) => await db().collection('test-student-questions').findOne({ testId, studentId });

module.exports.save = async (questions) => (await db().collection('test-student-questions').insertOne(questions)).ops[0];