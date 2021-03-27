const { db } = require("../db");

const COLLECTION = "questions";

module.exports.findById = async (id) =>
  await db().collection(COLLECTION).findOne({ _id: id });

module.exports.findRandom = async (size) =>
  await db()
    .collection(COLLECTION)
    .aggregate([{ $sample: { size } }])
    .toArray();
