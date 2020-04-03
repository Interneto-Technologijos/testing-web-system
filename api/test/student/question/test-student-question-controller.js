const asyncHandler = require('express-async-handler');

const testStudentQuestionService = require('./test-student-question-service');

module.exports.init = app => {
    app.get(
        '/api/tests/:testId/students/:studentId/questions',
        asyncHandler(async (req, res) => {
            try {
                const { questions } =
                    await testStudentQuestionService.getQuestionsByTestIdAndStudentId(req.params.testId, req.params.studentId);
                res.status(200).send(questions.map(question => ({
                    id: question.id,
                    question: question.question,
                    options: question.options,
                })));
            } catch (error) {
                console.error(error);
                res.status(400).send({ message: error.message });
            }
        }),
    );
};