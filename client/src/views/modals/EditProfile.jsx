import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { Form, FormGroup, Label, Input, } from 'reactstrap';
import { UserType, UserTitle } from '../../utils/constants';
import { initialFormInputState, cleanWhiteSpaces } from '../../utils/constants/form.constants';
import { profileUpdater } from '../../utils/dapp/profileWorker';

class EditProfile extends Component {
  state = {
    formdata: {
      firstName: { ...initialFormInputState },
      lastName: { ...initialFormInputState }
    }
  }

  setOwnState(state, callback = () => { }) {
    this.setState({ ...this.state, ...state }, callback);
  }

  setFormData(formdata, callback = () => { }) {
    this.setOwnState({ formdata: { ...this.state.formdata, ...formdata }, callback });
  }

  setFirstName(val) {
    const value = cleanWhiteSpaces(val);
    this.setFormData({
      firstName: {
        value: value, faulty: false, error: ""
      }
    })
  }

  setLastName(val) {
    const value = cleanWhiteSpaces(val);
    this.setFormData({
      lastName: {
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

  editProfile(ethAddress) {
    if (this.validated()) {
      const { type } = this.props.match.params;
      const { firstName, lastName } = this.state.formdata;
      profileUpdater({
        addr: ethAddress, userType: type,
        firstName: firstName.value, lastName: lastName.value
      }).then(() => {
        window.location.assign("/");
      }).catch(e => {
        alert(`Sorry. We couldn't update profile. See console for error(s)`);
        console.log(e);
      })
    }
  }

  render() {
    const { adminProfiles, shopOwnersProfiles } = this.props.profiles;
    const { id, type } = this.props.match.params;
    const profile = (type !== UserType.ShopOwner ? adminProfiles : shopOwnersProfiles);

    // check to ensure that our profiles have already been loaded
    if (profile.length > 0) {
      const { addr, firstName, lastName } = profile[id];
      return (
        <WorkModalMaster title={`Edit ${UserTitle[type]} Profile`} actionTitle="Proceed" actionDoer={() => this.editProfile(addr)}>
          <Form onSubmit={e => { e.preventDefault(); this.editProfile(addr); return false; }}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" maxLength="32" defaultValue={firstName} name="fname"
                onChange={e => this.setFirstName(e.target.value)} id="firstName" placeholder="Enter first name" />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name </Label>
              <Input type="text" maxLength="32" defaultValue={lastName} name="password"
                onChange={e => this.setLastName(e.target.value)} id="lastName" placeholder="Enter last name" />
            </FormGroup>
          </Form>

        </WorkModalMaster>
      )
    } else {
      return (<></>);
    }
  }
}

const mapStateToProps = state => ({
  profiles: {
    adminProfiles: state.adminProfiles,
    shopOwnersProfiles: state.shopOwnersProfiles
  }
})

const mapDispatchToProps = dispatch => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProfile));