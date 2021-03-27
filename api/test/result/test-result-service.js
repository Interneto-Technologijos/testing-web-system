const async = require("async");

const questionRepository = require("../../question/question-repository");
const testStudentQuestionRepository = require("../student/question/test-student-question-repository");

module.exports.getResultsByTestId = async (testId) => {
  const testStudentQuestions = await testStudentQuestionRepository.findByTestId(
    testId
  );

  if (!testStudentQuestions.length) {
    throw Error("Test does not exist");
  }

  return (
    await async.mapLimit(
      testStudentQuestions,
      10,
      async (testStudentQuestion) => {
        const marks = await async.mapLimit(
          testStudentQuestion.questions,
          10,
          async (question) => {
            const { corectOption } = await questionRepository.findById(
              question.questionId
            );
            return corectOption === question.options[question.answerIndex]
              ? 0.1
              : 0;
          }
        );
        return {
          studentId: testStudentQuestion.studentId,
          mark: marks.reduce((sum, mark) => sum + mark, 0).toFixed(1),
        };
      }
    )
  ).sort((r1, r2) => r1.studentId > r2.studentId);
};
