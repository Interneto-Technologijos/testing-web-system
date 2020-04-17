const { MongoClient } = require('mongodb');

let client = null;

module.exports.connect = async () => {
    console.log('Connecting to: ', process.env.MONGO_URL);
    client = await MongoClient.connect(process.env.MONGO_URL, { useUnifiedTopology: true });
    console.log('Connected');
};

module.exports.close = () => client.close();

module.exports.db = () => client.db(process.env.MONGO_DB || 'test');