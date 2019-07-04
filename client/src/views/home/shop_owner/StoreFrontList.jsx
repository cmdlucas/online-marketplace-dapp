import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { storeFrontsFetcher, storeFrontActivator } from '../../../utils/dapp/storeFrontWorker';
import EachStoreFrontCard from './EachStoreFrontCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setStoreFronts } from '../../../model/redux/action/storeFronts';
import { createstorefronturl } from '../../../utils/constants';

class StoreFrontList extends Component
{
    state = { loaded: false, storeFronts: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadStoreFronts() {
        const { addr } = window.dapp.defaultProfile;
        storeFrontsFetcher(addr).then(storeFronts => {
            //set admin profiles globally
            this.setOwnState({ loaded: true });
            this.props.setStoreFronts(storeFronts || []);
        }).catch(e => {
            alert(`Failed. Could not fetch store fronts. See console for error(s).`);
            console.log(e)
        });
    }

    storeFrontActivator(active, index) {
        // perform activation action on store front in global state for faster UI response
        const storeFronts = this.props.storeFronts;
        storeFronts[index].active = active;
        this.props.setStoreFronts(storeFronts);
        // deactivate store front in storage
        storeFrontActivator(storeFronts[index].sFID, active).catch(e => {
            console.log(e);
            alert(`Failed. Couldn't ${active ? "activate" : "deactivate"} store front. See console for error(s). Reverting changes...`);
            storeFronts[index].active = !active;
            this.props.setStoreFronts(storeFronts);
        });        
    }

    activateStoreFront(index) {
        //activate admin account
        this.storeFrontActivator(true, index);
    }

    deActivateStoreFront(index) {
        //deactivate admin account
        this.storeFrontActivator(false, index);
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
                                <div className="col d-flex flex-row-reverse flex-nowrap">
                                    <Link to={createstorefronturl}>
                                        <FontAwesomeIcon icon="plus-square" />
                                        {' '}
                                        <span>New store front</span>
                                    </Link>
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
                                                <EachStoreFrontCard key={index} index={index + 1}
                                                    name={storeFront.name}
                                                    productQty={storeFront.productQty}
                                                    active={storeFront.active}
                                                    activate={() => this.activateStoreFront(index)}
                                                    deActivate={() => this.deActivateStoreFront(index)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreFrontList);