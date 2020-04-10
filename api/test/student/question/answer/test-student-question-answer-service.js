const testRepository = require('../../../test-repository');
const testService = require('../../../test-service');

const testStudentQuestionRepository = require('../test-student-question-repository');

const testStudentQuestionAnswerRepository = require('./test-student-question-answer-repository');

class StudentQuestionAnswerError extends Error {
    constructor(message) {
        super(message);
    }
};

module.exports.StudentQuestionAnswerError = StudentQuestionAnswerError;

module.exports.answerTestIdStudentIdQuestionId = async (testId, studentId, questionId, answerIndex) => {
    const test = await testRepository.findById(testId);
    if (!test) {
        throw new StudentQuestionAnswerError(`Test ID ${testId} does not exist`);
    }
    if (testService.getStatus(test) !== 'IN_PROGRESS') {
        throw new StudentQuestionAnswerError(`Test ID ${testId} is not started`);
    }
    const questions = await testStudentQuestionRepository.findByTestIdAndStudentId(testId, studentId);
    if (!questions) {
        throw new StudentQuestionAnswerError(`Student ID ${studentId} is not registered for test ID ${testId}`);
    }
    await testStudentQuestionAnswerRepository.save({ testId, studentId, questionId, answerIndex });
};