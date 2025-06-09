const app = require('express')();
app.get('/', (req, res) => {
  res.send('Hello');
});
module.exports = app