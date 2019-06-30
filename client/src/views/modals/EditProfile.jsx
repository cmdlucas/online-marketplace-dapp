import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { Form, FormGroup, Label, Input,} from 'reactstrap';
import { UserType } from '../../utils/constants';

class EditProfile extends Component {
    editProfile() {

    }

    render() {
        const { adminProfiles, shopOwnersProfiles } = this.props.profiles;
        const { id, type } = this.props.match.params;
        const profile = (type !== UserType.ShopOwner ? adminProfiles : shopOwnersProfiles );

        // check to ensure that our profiles have already been loaded
        if(profile.length > 0) {
            const { firstName, lastName } = profile[id];
            return (
                <WorkModalMaster prevUrl="/" title="Edit Profile" actionTitle="Proceed" actionDoer={() => this.editProfile()}>    
                    <Form>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" defaultValue={firstName} name="fname" id="firstName" placeholder="Enter first name" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name </Label>
                            <Input type="text" defaultValue={lastName} name="password" id="lastName" placeholder="Enter last name" />
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