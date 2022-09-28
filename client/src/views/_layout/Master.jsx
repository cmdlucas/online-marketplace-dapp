import React, { Component } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';

class Master extends Component {
  render() {
    return (
      <div className="container">
        <Header />
        <main className="d-block mb-5">
          {this.props.children}
        </main>
        <Footer />
      </div>
    )
  }
}

export default Master;