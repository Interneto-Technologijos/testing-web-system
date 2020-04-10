const asyncHandler = require('express-async-handler');
const Joi = require('@hapi/joi');

const testStudentQuestionService = require('./test-student-question-service');

module.exports.init = app => {
    app.get(
        '/api/tests/:testId/students/:studentId/questions',
        asyncHandler(async (req, res) => {
            try {
                await Joi.object({
                    testId: Joi.string().pattern(/^[0-9]{4}$/).required(),
                    studentId: Joi.string().pattern(/^[0-9]{8}$/).required(),
                }).validateAsync(req.params);

                const { questions } =
                    await testStudentQuestionService.getQuestionsByTestIdAndStudentId(req.params.testId, req.params.studentId);
                res.status(200).send(questions.map(question => ({
                    id: question.id,
                    question: question.question,
                    options: question.options,
                    answerIndex: question.answerIndex,
                })));
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                console.error(error);
                res.status(400).send({ message: error.message });
            }
        }),
    );
};