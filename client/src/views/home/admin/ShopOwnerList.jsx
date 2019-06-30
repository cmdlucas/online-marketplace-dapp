import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import EachUserCard from './EachUserCard';
import { profilesFetcher } from '../../../utils/dapp/profileWorker';
import { UserType } from '../../../utils/constants/a.constant';

class ShopOwnerList extends Component {
    state = { loaded: false, shopowners: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadShopOwners() {
        profilesFetcher(UserType.ShopOwner).then(shopowners => {
            //extract shopowner profiles
            this.setOwnState({ shopowners: shopowners, loaded: true })
        }).catch(e => {
            alert(`Failed. Could not fetch shopowners. See console for error(s).`);
            console.log(e)
        });
    }

    editShopOwnerProfile(index) {

    }

    activateShopOwner(index) {

    }

    deActivateShopOwner(index) {
        // deActivate shopowner in state for fast response
        const shopowners = [...this.state.shopowners];
        shopowners[index].active = false;
        this.setOwnState({ shopowners: [...shopowners] });
        // deActivate shopowner in storage        
    }

    componentDidMount() {
        this.loadShopOwners();
    }

    render() {
        const { loaded, shopowners } = this.state;
        return (
            <>
                <div className="row mt-5 no-gutters">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>ShopOwners List</h5>
                            </div>
                            <div className="card-body">
                                {!loaded && (
                                    <Spinner color="secondary" />
                                )}
                                {loaded && (<>
                                    {shopowners.length === 0 ? <h5>No shopowner found</h5> : ""}
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

export default ShopOwnerList;