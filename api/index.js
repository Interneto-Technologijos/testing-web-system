const app = require('./app');
const db = require('./db');

app.listen(process.env.PORT || 3000);
db.connect();