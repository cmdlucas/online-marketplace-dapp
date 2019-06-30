import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { editprofilematcher } from '../../utils/constants';
import EditProfile from './EditProfile';

class ModalSelector extends Component {
    render() {
        return (
            <>
                <Route path={editprofilematcher} exact component={EditProfile} />
            </>
        );
    }
}

export default ModalSelector;