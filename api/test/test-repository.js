const { db } = require('../db');

module.exports.save = async (test) => (await db().collection('tests').insertOne(test)).ops[0];