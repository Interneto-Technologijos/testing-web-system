const asyncHandler = require('express-async-handler');
const Joi = require('@hapi/joi');

const {answerTestIdStudentIdQuestionId, StudentQuestionAnswerError} = require('./test-student-question-answer-service');

module.exports.init = app => {
    app.post(
        '/api/tests/:testId/students/:studentId/questions/:questionId/answers',
        asyncHandler(async (req, res) => {
            try {
                await Joi.object({
                    testId: Joi.string().pattern(/^[0-9]{4}$/).required(),
                    studentId: Joi.string().pattern(/^[0-9]{8}$/).required(),
                    questionId: Joi.string().pattern(/^[0-9]{1,2}$/).required(),
                }).validateAsync(req.params);

                await Joi.object({
                    answerIndex: Joi.number().min(0).max(3).required(),
                }).validateAsync(req.body);

                await answerTestIdStudentIdQuestionId(req.params.testId, req.params.studentId, req.params.questionId, req.body.answerIndex);
                
                res.send({});
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                if (error instanceof StudentQuestionAnswerError) {
                    res.status(400).send({ message: error.message });
                    return;
                }
                console.error(error);
                res.status(500).send({});
            }
        }),
    );
};