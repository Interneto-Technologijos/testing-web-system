const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const asyncHandler = require('express-async-handler');
const Joi = require('@hapi/joi');

const testService = require('./test-service');

passport.use(new BasicStrategy(
    (userId, password, done) => {
        console.log(userId, password)
        if (userId !== 'admin' || password !== process.env.ADMIN_PASSWORD) {
            return done(null, false);
        }
        return done(null, {});
    }
));

module.exports.init = app => {
    app.post(
        '/api/tests',
        passport.authenticate('basic', { session: false }),
        asyncHandler(async (_req, res) => {
            const { _id, timer, status } = await testService.createTest();
            res.status(200).send({ id: _id, timer, status });
        }),
    );

    app.get(
        '/api/tests/:id',
        asyncHandler(async (req, res) => {
            try {
                await Joi.object({
                    id: Joi.string().pattern(/^[0-9]{4}$/).required(),
                }).validateAsync(req.params);

                const { _id, timer, status } = await testService.getTestById(req.params.id);
                res.status(200).send({ id: _id, timer, status });
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(400).send({ message: error.message });
            }
        }),
    );

    app.patch(
        '/api/tests/:id',
        asyncHandler(async (req, res) => {
            try {
                await Joi.object({
                    id: Joi.string().pattern(/^[0-9]{4}$/).required(),
                }).validateAsync(req.params);

                await Joi.object({
                    status: Joi.string().valid('WAITING', 'IN_PROGRESS')
                }).validateAsync(req.body);

                const { _id, timer, status, startedTimestamp } = await testService.updateStatusById(req.params.id, req.body.status);

                res.status(200).send({ id: _id, timer, status, startedTimestamp: startedTimestamp.toISOString() });
            } catch (error) {
                if (error instanceof Joi.ValidationError) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(400).send({ message: error.message });
            }
        }),
    );
};