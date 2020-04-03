const { db } = require('../db');

module.exports.findRandom2 = async (id) => await db().collection('questions').aggregate([{ $sample: { size: 2 } }]).toArray();