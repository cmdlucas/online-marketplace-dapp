import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { editprofilematcher, createprofilematcher, UserType } from '../../utils/constants';
import AddProfile from './AddProfile';
import EditProfile from './EditProfile';

class ModalSelector extends Component {
    render() {
        const { userType } = window.dapp.defaultProfile;
        return (
            <Switch>
                {  /** Admin modals */
                    (userType === UserType.Owner || userType === UserType.Admin) &&
                    (
                        <>
                            <Route path={editprofilematcher} exact component={EditProfile} />
                            <Route path={createprofilematcher} exact component={AddProfile} />
                        </>
                    )
                }
            </Switch>
        );
    }
}

export default ModalSelector;