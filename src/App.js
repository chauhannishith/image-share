import React, { Component } from 'react';
import Footer from './components/Footer'
import Header from './components/Header'
import Main from './components/Main'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="container">
      	<Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
