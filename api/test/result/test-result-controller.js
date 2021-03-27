const asyncHandler = require("express-async-handler");
const Joi = require("@hapi/joi");

const testResultService = require("./test-result-service");

module.exports.init = (app) => {
  app.get(
    "/api/tests/:testId/results",
    asyncHandler(async (req, res) => {
      try {
        await Joi.object({
          testId: Joi.string()
            .pattern(/^[0-9]{4}$/)
            .required(),
        }).validateAsync(req.params);

        res
          .status(200)
          .send(await testResultService.getResultsByTestId(req.params.testId));
      } catch (error) {
        if (error instanceof Joi.ValidationError) {
          res.status(400).json({ message: error.message });
          return;
        }
        res.status(400).send({ message: error.message });
      }
    })
  );
};
