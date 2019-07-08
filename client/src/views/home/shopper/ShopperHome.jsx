import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ShopperStoreFrontList from './ShopperStoreFrontList';
import { homematcher, homeurl, createstorefronturl, storefrontmatcher, storefronturi } from '../../../utils/constants';
import ShopperProductList from './ShopperProductList';

class ShopperHome extends Component
{
    render() {
        return (
            <>
                <p> Welcome Dear Shopper, </p>
                <Switch>
                    {/** Home page */}
                    <Route exact path={homematcher} component={ShopperStoreFrontList} />
                    {/** Create Store Front */}
                    <Route exact path={createstorefronturl} component={ShopperStoreFrontList} />
                    {/** Redirect home if the */}
                    <Route exact path={storefronturi} render={() => <Redirect to={homeurl} />} />
                    {/** Store front products page */}
                    <Route path={storefrontmatcher} component={ShopperProductList} />
                    {/** Allow other products page */}
                    <Route path={storefronturi} component={ShopperProductList} />
                </Switch>
                
            </>
        );
    }
}

export default ShopperHome;