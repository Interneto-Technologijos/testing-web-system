const asyncHandler = require('express-async-handler');

const testService = require('./test-service');

module.exports.init = app => {
    app.post(
        '/api/tests',
        asyncHandler(async (_req, res) => {
            const { _id, timer, status } = await testService.createTest();
            res.status(200).send({ id: _id, timer, status });
        }),
    );

    app.get(
        '/api/tests/:id',
        asyncHandler(async (req, res) => {
            try {
                const { _id, timer, status } = await testService.getTestById(req.params.id);
                res.status(200).send({ id: _id, timer, status });
            } catch (error) {
                res.status(400).send({ message: error.message });
            }
        }),
    );

    app.patch(
        '/api/tests/:id',
        asyncHandler(async (req, res) => {
            try {
                const { _id, timer, status, startedTimestamp } = await testService.updateStatusById(req.params.id, req.body.status);
                res.status(200).send({ id: _id, timer, status, startedTimestamp: startedTimestamp.toISOString() });
            } catch (error) {
                console.log(error);
            }
        }),
    );
};