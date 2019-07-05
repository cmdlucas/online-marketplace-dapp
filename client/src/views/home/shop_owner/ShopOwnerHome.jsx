import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StoreFrontList from './StoreFrontList';
import { homematcher, homeurl, createstorefronturl, storefrontmatcher, storefronturi } from '../../../utils/constants';
import ProductList from './ProductList';

class ShopOwnerHome extends Component {
    render() {
        return (
            <>
                <p> Welcome {window.dapp.defaultProfile.firstName}, </p>
                <Switch>
                    {/** Home page */}
                    <Route exact path={homematcher} component={StoreFrontList} />
                    {/** Create Store Front */}
                    <Route exact path={createstorefronturl} component={StoreFrontList} />
                    {/** Redirect home if the  */}
                    <Route exact path={storefronturi} render={() => <Redirect to={homeurl} />} />
                    {/** Store front products page */}
                    <Route path={storefrontmatcher} component={ProductList} />
                    {/** Allow other products page */}
                    <Route path={storefronturi} component={ProductList} />
                </Switch>
            </>
        );
    }
}

export default ShopOwnerHome;