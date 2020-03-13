const asyncHandler = require('express-async-handler');

const testService = require('./test-service');

module.exports.init = app => {
    app.post(
        '/api/tests',
        asyncHandler(async (_req, res) => {
            const { _id, timer } = await testService.createTest();
            res.status(200).send({ id: _id, timer });
        }),
    );
};