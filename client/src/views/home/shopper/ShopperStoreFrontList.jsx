import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { storeFrontsFetcher } from '../../../utils/dapp/shopperActionsWorker';
import ShopperStoreFrontCard from './ShopperStoreFrontCard';
import { setStoreFronts } from '../../../model/redux/action/storeFronts';

class ShopperStoreFrontList extends Component
{
    state = { loaded: false };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadStoreFronts() {
        storeFrontsFetcher().then(storeFronts => {
            // set admin profiles globally
            this.setOwnState({ loaded: true });
            // It's probably an anti-pattern to load all stores and filtering the active ones here
            // but we'll do that just for convenience sake.
            this.props.setStoreFronts(storeFronts.filter((storeFront)=>storeFront.active) || []);
        }).catch(e => {
            alert(`Failed. Could not fetch store fronts. See console for error(s).`);
            console.log(e)
        });
    }

    componentDidMount() {
        this.loadStoreFronts();
    }

    render() {
        const { loaded } = this.state;
        const storeFronts = this.props.storeFronts;
        return (
            <div className="row mt-5 no-gutters">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5>Store Fronts List</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            {!loaded && (
                                <Spinner color="secondary" />
                            )}
                            {loaded && (<>
                                {storeFronts.length === 0 ? <h5>No store fronts found</h5> : ""}
                                <div className="row">
                                    {
                                        storeFronts.map((storeFront, index) => {
                                            return (
                                                <ShopperStoreFrontCard key={index} index={index + 1}
                                                    name={storeFront.name}
                                                    productQty={storeFront.productQty}
                                                    active={storeFront.active}/>
                                            )
                                        })
                                    }
                                </div>
                            </>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    storeFronts: state.storeFronts
})

const mapDispatchToProps = dispatch => ({
    setStoreFronts: storeFronts => dispatch(setStoreFronts(storeFronts))
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopperStoreFrontList);