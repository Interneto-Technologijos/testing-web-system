const { db } = require('../db');

module.exports.findRandom = async size => await db().collection('questions').aggregate([{ $sample: { size } }]).toArray();