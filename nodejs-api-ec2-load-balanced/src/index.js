const express = require('express');

const app = express();
const port = 3000;

app.get('/test', (req, res) => {
  console.log('Test API hit')
  res.send('Hello from the test endpoint! Cherry');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});