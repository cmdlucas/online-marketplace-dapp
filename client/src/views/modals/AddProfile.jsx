import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { UserTitle } from '../../utils/constants';
import { Form, FormGroup, Label, Input,} from 'reactstrap';
import { initialFormInputState, cleanWhiteSpaces } from '../../utils/constants/form.constants';
import { profileCreater } from '../../utils/dapp/profileWorker';

class AddProfile extends Component {
    state = {
        formdata: {
            firstName: {...initialFormInputState},
            lastName: {...initialFormInputState},
            ethAddress: {...initialFormInputState}
        }
    }

    setOwnState(state, callback = () => {}) {
        this.setState({ ...this.state, ...state }, callback);
    }

    setFormData(formdata, callback = () => {}) {
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

    setEthAddress(val) {
        const value = cleanWhiteSpaces(val);
        this.setFormData({
            ethAddress: {
                value: value, faulty: false, error: ""
            }
        })
    }

    validated() {
        for(let id in this.state.formdata) {
            if(this.state.formdata[id].value.length === 0) {
                alert(`Invalid ${id} provided`);
                return false;
            }
        }
        return true;
    }

    addProfile() {
        if(this.validated()) {
            const { type } = this.props.match.params;
            const { firstName, lastName, ethAddress } = this.state.formdata;
            profileCreater({
                addr: ethAddress.value, userType: type,
                firstName: firstName.value, lastName: lastName.value 
            }).then(() => {
                window.location.assign("/");
            }).catch(e => {
                alert(`Sorry. We couldn't create profile. See console for error(s)`);
                console.log(e);
            })
        }
    }

    render() {
        const { type } = this.props.match.params;
        return (
            <WorkModalMaster title={`Create ${UserTitle[type]} Profile`} actionTitle="Proceed" actionDoer={() => this.addProfile()}>    
                <Form onSubmit={e=>{e.preventDefault(); this.addProfile(); return false;}}>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input type="text" maxLength="32" name="fname" id="firstName"
                            onChange={e => this.setFirstName(e.target.value)} placeholder="Enter first name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name </Label>
                        <Input type="text" maxLength="32" name="password" id="lastName" 
                            onChange={e => this.setLastName(e.target.value)} placeholder="Enter last name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="ethAddress">Address (Hex Value) </Label>
                        <Input type="text" minLength="42" maxLength="42" name="ethAddress" id="ethAddress"
                            onChange={e => this.setEthAddress(e.target.value)}  placeholder="Enter ethereum account address" />
                    </FormGroup>
                </Form>
            </WorkModalMaster>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddProfile));