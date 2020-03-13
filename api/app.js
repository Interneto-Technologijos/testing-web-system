const express = require('express');

const testController = require('./test/test-controller');

const app = express();

app.use(express.json());

testController.init(app);

let server = null;

module.exports.listen = port => new Promise(resolve => {
    console.log(`Starting API server on port ${port}`);
    server = app.listen(port);
    resolve();
});

module.exports.close = () => new Promise(resolve => server.close(resolve));