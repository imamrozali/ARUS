const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(3002, () => {
  console.log('Express Hello World server running on port 3002');
});