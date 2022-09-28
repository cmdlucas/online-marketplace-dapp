import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { Form, FormGroup, Label, Input, } from 'reactstrap';
import { initialFormInputState, cleanWhiteSpaces } from '../../utils/constants/form.constants';
import { storeFrontCreater } from '../../utils/dapp/storeFrontWorker';

class AddStoreFront extends Component {
  state = {
    formdata: {
      name: { ...initialFormInputState },
    }
  }

  setOwnState(state, callback = () => { }) {
    this.setState({ ...this.state, ...state }, callback);
  }

  setFormData(formdata, callback = () => { }) {
    this.setOwnState({ formdata: { ...this.state.formdata, ...formdata }, callback });
  }

  setName(val) {
    const value = cleanWhiteSpaces(val);
    this.setFormData({
      name: {
        value: value, faulty: false, error: ""
      }
    })
  }

  validated() {
    for (let id in this.state.formdata) {
      if (this.state.formdata[id].value.length === 0) {
        alert(`Invalid ${id} provided`);
        return false;
      }
    }
    return true;
  }

  addStoreFront() {
    if (this.validated()) {
      const { name } = this.state.formdata;
      storeFrontCreater({
        name: name.value
      }).then(() => {
        window.location.assign("/");
      }).catch(e => {
        alert(`Sorry. We couldn't create store front. See console for error(s)`);
        console.log(e);
      })
    }
  }

  render() {
    return (
      <WorkModalMaster title={`Create Store Front`} actionTitle="Proceed" actionDoer={() => this.addStoreFront()}>
        <Form onSubmit={e => { e.preventDefault(); this.addStoreFront(); return false; }}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" maxLength="32" name="name" id="name"
              onChange={e => this.setName(e.target.value)} placeholder="Enter store front's name" />
          </FormGroup>
        </Form>
      </WorkModalMaster>
    )
  }
}

const mapStateToProps = state => ({
  storeFronts: state.storeFronts
})

const mapDispatchToProps = dispatch => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddStoreFront));