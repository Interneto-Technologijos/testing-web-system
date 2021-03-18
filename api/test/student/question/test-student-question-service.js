const questionRepository = require("../../../question/question-repository");
const testStudentQuestionRepository = require("./test-student-question-repository");

const createTestStudentQuestions = async (testId, studentId) => {
  return {
    testId,
    studentId,
    questions: (await questionRepository.findRandom(20)).map(
      (question, index) => {
        question.incorrectOptions.splice(
          Math.floor(Math.random() * 4),
          0,
          question.corectOption
        );
        return {
          id: index + 1,
          questionId: question._id,
          question: question.question,
          options: question.incorrectOptions,
        };
      }
    ),
  };
};

module.exports.getQuestionsByTestIdAndStudentId = async (testId, studentId) => {
  const existingQuestions = await testStudentQuestionRepository.findByTestIdAndStudentId(
    testId,
    studentId
  );
  if (existingQuestions) {
    return existingQuestions;
  }

  const questions = await createTestStudentQuestions(testId, studentId);
  return testStudentQuestionRepository.save(questions);
};
