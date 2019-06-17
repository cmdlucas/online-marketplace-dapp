import React, { Component } from "react";
import activateDApp from "./utils/activateDApp";

import "./App.css";

class App extends Component {

  state = { storageValue: 0 };

  componentDidMount() {
    // Provide all dapp utils on window Object to provide quick accessibility
    // run our example after successful provision
    // log error, if provisioning failed
    activateDApp().then(() => this.runExample()).catch(e => console.log(e));    
  };

  runExample() {
    const { SimpleStorage } = window.dapp.contracts;
    SimpleStorage.deployed().then(async instance => {
      // set value on contract
      await instance.setMap(5, 50, { from: window.dapp.accounts[0] });
      // retrieve value from contract and set to state
      const mapValue = await instance.getMap(5);
      // update state
      this.setState({ ...this.state, storageValue: `${mapValue}` });
    })
  }

  render() {
    if (!window.dapp) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try setting/getting value stored on contract.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
