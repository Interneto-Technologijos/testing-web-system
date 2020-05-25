const questionRepository = require('../../../question/question-repository');
const testStudentQuestionRepository = require('./test-student-question-repository');

const createTestStudentQuestions = async (testId, studentId) => ({
    testId,
    studentId,
    questions: (await questionRepository.findRandom(20)).map((question, index) => ({
        id: index + 1,
        questionId: question._id,
        question: question.question,
        options: [...question.incorrectOptions, question.corectOption],
    })),
});

module.exports.getQuestionsByTestIdAndStudentId = async (testId, studentId) => {
    const existingQuestions = await testStudentQuestionRepository.findByTestIdAndStudentId(testId, studentId);
    if (existingQuestions) {
        return existingQuestions; 
    }

    const questions = await createTestStudentQuestions(testId, studentId);
    return testStudentQuestionRepository.save(questions);
};