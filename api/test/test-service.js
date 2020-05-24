const moment = require('moment');

const testRepository = require('./test-repository');

const getStatus = test => {
    if (!test.startedTimestamp) {
        return 'WAITING';
    }
    if (test.startedTimestamp.getTime() < moment().subtract(test.timer, 'seconds').valueOf()) {
        return 'COMPLETED';
    }
    return 'IN_PROGRESS';
};

module.exports.getStatus = getStatus;

module.exports.createTest = async () => {
    const id = (Math.round(Math.random() * 8999) + 1000).toString();
    const timer = 480;
    const status = getStatus({ _id: id, timer });
    const test = await testRepository.save({ _id: id, timer });
    return { ...test, status };
};

module.exports.updateStatusById = async (id, status) => {
    const startedTimestamp = moment().toDate();
    const test = await testRepository.updateStartedTimestampById(id, startedTimestamp);
    if (!test) {
        throw Error('Test does not exist');
    }
    return { ...test, status };
};

module.exports.getTestById = async (id) => {
    const test = await testRepository.findById(id);

    if (!test) {
        throw Error('Test does not exist');
    }

    const status = getStatus(test);
    return { ...test, status };
}