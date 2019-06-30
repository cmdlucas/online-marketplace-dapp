import React, { Component } from 'react';
import AdminList from './AminList';
import ShopOwnerList from './ShopOwnerList';
import { UserType } from '../../../utils/constants';

class AdminHome extends Component {
    render() {
        return (
            <>
                <p> Welcome {window.dapp.defaultProfile.firstName}, </p>
                {window.dapp.defaultProfile.userType === UserType.Owner && <AdminList />}
                <ShopOwnerList />
            </>
        );
    }
}

export default AdminHome;