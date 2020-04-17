const app = require('./app');
const db = require('./db');

db.connect()
    .then(() => app.listen(process.env.PORT || 3000))
    .catch(console.error);