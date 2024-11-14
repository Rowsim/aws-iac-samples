const express = require('express');

const app = express();
const port = 3000;

app.get('/test', (req, res) => {
  res.send('Hello from the test endpoint! :)');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});