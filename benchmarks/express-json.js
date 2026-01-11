const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'hello', data: [1, 2, 3] });
});

app.listen(3005, () => {
  console.log('Express JSON server running on port 3005');
});