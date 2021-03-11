import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Coin from './components/Coin.jsx';
import Home from './components/Home.jsx';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/coin/:id">
            <Coin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
