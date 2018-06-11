import React, { Component } from 'react';
import Main from './components/Main'
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: []
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="container">
        <Main />
      </div>
    );
  }
}

export default App;
