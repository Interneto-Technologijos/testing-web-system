const testRepository = require('./test-repository');

module.exports.createTest = () => {
    const id = (Math.round(Math.random() * 8999) + 1000).toString();
    const timer = 480;

    return testRepository.save({ _id: id, timer });
};