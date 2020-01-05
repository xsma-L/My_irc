import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import {Rooms} from './components/Room.js';
import {Home} from './components/Home.js';
import {Private} from './components/Private.js';
import './media-queries.css';

class App extends Component {

  render() {
    return (
      <div>
        <BrowserRouter>
          <Route exact path="/" component={Home} />
          <Route exact path="/room" component={Rooms} />
          <Route exact path="/Private/message" component={Private} />
        </BrowserRouter>  
      </div>
    )
  }
}

export default App;