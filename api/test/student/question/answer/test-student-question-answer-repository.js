const { db } = require('../../../../db');

module.exports.save = async ({ testId, studentId, questionId, answerIndex }) =>
    await db().collection('test-student-questions').update(
        { testId, studentId },
        { $set: { [`questions.${questionId - 1}.answerIndex`]: answerIndex } },
    );