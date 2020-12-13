import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppRouter from './routes/router';

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);
