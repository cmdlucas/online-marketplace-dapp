import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import EachUserCard from './EachUserCard';
import { profilesFetcher, shopOwnerActivator } from '../../../utils/dapp/profileWorker';
import { UserType } from '../../../utils/constants/a.constant';
import { setShopOwnersProfiles } from '../../../model/redux/action/profiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createprofileurl } from '../../../utils/constants';

class ShopOwnerList extends Component {
    state = { loaded: false, shopowners: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadShopOwners() {
        profilesFetcher(UserType.ShopOwner).then(shopowners => {
            //extract shopowner profiles
            this.setOwnState({ loaded: true });
            this.props.setProfiles(shopowners);
        }).catch(e => {
            alert(`Failed. Could not fetch shop owners. See console for error(s).`);
            console.log(e)
        });
    }

    accountActivator(active, index) {
        // perform activation action admin in global state for faster UI response
        const shopowners = this.props.shopOwnerProfiles;
        shopowners[index].active = active;
        this.props.setProfiles(shopowners);
        // deActivate admin in storage
        shopOwnerActivator(active, shopowners[index].addr).catch(e => {
            console.log(e);
            alert(`Failed. Couldn't ${active ? "activate" : "deactivate"} shop owner. See console for error(s). Reverting changes...`);
            shopowners[index].active = !active;
            this.props.setProfiles(shopowners);
        })
    }

    activateShopOwner(index) {
        //activate admin account
        this.accountActivator(true, index);
    }

    deActivateShopOwner(index) {
        //deactivate admin account
        this.accountActivator(false, index);
    }

    componentDidMount() {
        this.loadShopOwners();
    }

    render() {
        const { loaded } = this.state;
        const shopowners = this.props.shopOwnerProfiles;
        return (
            <>
                <div className="row mt-5 no-gutters">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col">
                                        <h5>Shop Owner List</h5>
                                    </div>
                                    <div className="col d-flex flex-row-reverse flex-nowrap">
                                        <Link to={createprofileurl + "/2"}>
                                            <FontAwesomeIcon icon="plus-square" />
                                            {' '}
                                            <span>New Shop Owner</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {!loaded && (
                                    <Spinner color="secondary" />
                                )}
                                {loaded && (<>
                                    {shopowners.length === 0 ? <h5>No shop owner found</h5> : ""}
                                    <div className="row">
                                    {
                                        shopowners.map((shopowner, index) => {
                                            return (
                                                <EachUserCard key={index} index={index + 1}
                                                    firstName={shopowner.firstName}
                                                    lastName={shopowner.lastName}
                                                    addr={shopowner.addr}
                                                    typeName="ShopOwner"
                                                    type={shopowner.userType}
                                                    active={shopowner.active}
                                                    activate={() => this.activateShopOwner(index)}
                                                    deActivate={() => this.deActivateShopOwner(index)} />
                                            )
                                        })
                                    }
                                    </div>
                                </>)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    shopOwnerProfiles: state.shopOwnersProfiles
})

const mapDispatchToProps = dispatch => ({
    setProfiles: profiles => dispatch(setShopOwnersProfiles(profiles))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopOwnerList));