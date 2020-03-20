const { db } = require('../db');

module.exports.save = async (test) => (await db().collection('tests').insertOne(test)).ops[0];

module.exports.findById = async (id) => await db().collection('tests').findOne({ _id: id });