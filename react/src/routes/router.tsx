import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import EditView from './configs/EditView';
import MainView from './home/MainView';

const AppRouter = () => {
  return (
    <main className="app-container">
      <Router>
        <Switch>
          <Route path="/configs/edit/:file" component={EditView} />
          <Route path="/">
            <MainView />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}

export default AppRouter;
