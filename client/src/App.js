import React, { Component } from "react";
import activateDApp from "./utils/activateDApp";

import PreLoad from "./views/home/PreLoad";
import Nominator from "./views/home/Nominator";

class App extends Component {
  
  state = {}

  setOwnState(state, callback = () => { }) {
    this.setState({ ...this.state, ...state }, callback);
  }

  resetLoadingState() {
    this.setOwnState({ dAppLoading: true, dAppInit: false, dAppInitFailed: false, error: "" });
  }

  loadDApp(force = false) {
    // tell state that dApp is loading
    this.resetLoadingState();
    // Provision all dapp utils on window Object to provide quick accessibility
    // set app as initiated after successful provisioning
    // present error, if provisioning failed
    activateDApp(force).then(() => this.setDAppInitiated()).catch(e => this.setDAppInitFailed(e));
  }

  setDAppInitiated() {
    this.setOwnState({ dAppLoading: false, dAppInit: true });
  }

  setDAppInitFailed(e) {
    this.setOwnState({ dAppLoading: false, dAppInitFailed: true, error: e });
  }

  componentDidMount() {
    this.loadDApp();
  };

  render() {
    const { dAppLoading, dAppInitFailed, dAppInit, error } = this.state;
    return (
      <>
        {dAppLoading || dAppInitFailed ? (
          <PreLoad dAppLoading={dAppLoading} dAppInitFailed={dAppInitFailed}
            reloader={() => this.loadDApp(true)} error={error} />
        ) : ""}

        { dAppInit ? <Nominator /> : "" }
      </>
    );
  }
}

export default App;
