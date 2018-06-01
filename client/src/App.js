import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: []
    }
  }

  componentDidMount() {
    fetch('/test')
    .then(response => {
      response.json()
      .then(data => this.setState({user: data}))
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.user.first} {this.state.user.last}
          <br />
          Let's get started.
        </p>
      </div>
    );
  }
}

export default App;
