const { db } = require('../db');

module.exports.save = async (test) => (await db().collection('tests').insertOne(test)).ops[0];

module.exports.findById = async (id) => await db().collection('tests').findOne({ _id: id });

module.exports.updateStartedTimestampById = async (id, startedTimestamp) => {
    await db().collection('tests').updateOne({ _id: id }, { $set: { startedTimestamp } });
    return module.exports.findById(id);
};