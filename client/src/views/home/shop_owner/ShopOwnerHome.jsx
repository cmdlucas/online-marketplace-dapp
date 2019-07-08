import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StoreFrontList from './StoreFrontList';
import { homematcher, homeurl, createstorefronturl, storefrontmatcher, storefronturi } from '../../../utils/constants';
import ProductList from './ProductList';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WithdrawFunds from '../../modals/WithdrawFunds';
import { shopOwnerAccBal } from '../../../utils/dapp/accountWorker';

class ShopOwnerHome extends Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, balance: 0 };
    }

    setOwnState(state) {
        this.setState({ ...this.state, ...state});
    }

    toggle() {
        this.setOwnState({
            modal: !this.state.modal
        });
    }

    loadBalance() {
        shopOwnerAccBal()
        .then(bal => {
            this.setOwnState({balance: bal});
        }).catch(e => {
            console.log(e);
            alert(`We couldn't get your account balance. See console for error(s).`);
        })
    }

    componentDidMount() {
        this.loadBalance();
    }

    render() {
        const { modal, balance } = this.state;
        return (
            <>
                {modal && <WithdrawFunds max={balance} modal={modal} toggle={() => this.toggle()} />}
                <Row>
                    <Col size={6}>
                        <p> Welcome {window.dapp.defaultProfile.firstName}, </p>
                    </Col>
                    <Col size={6}>
                        <div style={{float: "right"}}>
                            <FontAwesomeIcon icon="money-bill" /> {' '}
                            ETH {balance} {' '}
                            || {' '}
                            <Button color="success" onClick={() => this.toggle()}>
                                <small>Withdraw</small>
                            </Button>
                        </div>

                    </Col>

                </Row>
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