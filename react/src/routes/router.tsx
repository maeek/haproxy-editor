import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import MainView from './home/MainView';

const AppRouter = () => {
  return (
    <main className="app-container">
      <Router>
        <Switch>
          <Route path="/">
            <MainView />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default AppRouter;
