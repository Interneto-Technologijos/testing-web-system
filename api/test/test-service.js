const testRepository = require('./test-repository');

const getStatus = test => {
    if (!test.startedTimestamp) {
        return 'WAITING';
    }
};

module.exports.createTest = async () => {
    const id = (Math.round(Math.random() * 8999) + 1000).toString();
    const timer = 480;
    const status = getStatus({ _id: id, timer });
    const test = await testRepository.save({ _id: id, timer });
    return { ...test, status };
};

module.exports.updateStatusById = async (id, status) => {
    // const test = await testRepository.findById(id);
    
    
    // if (status !== 'WAITING') {
    //     throw new Error('Test can not be started');
    // }

    const startedTimestamp = new Date();
    const test = await testRepository.updateStartedTimestampById(id, startedTimestamp);
    //const status = getStatus(test);
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