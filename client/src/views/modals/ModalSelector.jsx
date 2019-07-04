import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { editprofilematcher, createprofilematcher, UserType, createstorefrontmatcher, editproductmatcher, createproductmatcher } from '../../utils/constants';
import AddProfile from './AddProfile';
import EditProfile from './EditProfile';
import AddStoreFront from './AddStoreFront';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';

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
                {  /** Shop Owner modals */
                    (userType === UserType.ShopOwner) &&
                    (
                        <>
                            <Route path={createstorefrontmatcher} exact component={AddStoreFront} />
                            <Route path={createproductmatcher} exact component={AddProduct} />
                            <Route path={editproductmatcher} exact component={EditProduct} />
                        </>
                    )
                }
            </Switch>
        );
    }
}

export default ModalSelector;