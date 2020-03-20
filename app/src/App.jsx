import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Test from './Test';
import TestDashboard from './TestDashboard';

export default () => {
  return <Router>
    <Switch>
      <Route path="/test/:id" render={props => <Test testId={props.match.params.id} />} />
      <Route path="/">
        <TestDashboard />
      </Route>
    </Switch>
  </Router>
};
