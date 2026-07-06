const app = require('express')();
app.get('/', (req, res) => {
  res.send('Hello from video call');
});
module.exports = app