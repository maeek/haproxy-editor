import express from 'express';

const App = express();

App.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/')
});
