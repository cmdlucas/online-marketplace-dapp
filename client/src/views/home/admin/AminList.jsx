import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import EachUserCard from './EachUserCard';
import { profilesFetcher, adminActivator } from '../../../utils/dapp/profileWorker';
import { UserType } from '../../../utils/constants/a.constant';
import { setAdminsProfiles } from '../../../model/redux/action/profiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createprofileurl } from '../../../utils/constants';

class AdminList extends Component {
    state = { loaded: false, admins: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadAdmins() {
        profilesFetcher(UserType.Admin).then(admins => {
            //set admin profiles globally
            this.setOwnState({ loaded: true });
            this.props.setProfiles(admins);
        }).catch(e => {
            alert(`Failed. Could not fetch admins. See console for error(s).`);
            console.log(e)
        });
    }

    accountActivator(active, index) {
        // perform activation action admin in global state for faster UI response
        const admins = this.props.adminProfiles;
        admins[index].active = active;
        this.props.setProfiles(admins);
        // deActivate admin in storage
        adminActivator(active, admins[index].addr).catch(e => {
            console.log(e);
            alert(`Failed. Couldn't ${active ? "activate" : "deactivate"} admin. See console for error(s). Reverting changes...`);
            admins[index].active = !active;
            this.props.setProfiles(admins);
        })
    }

    activateAdmin(index) {
        //activate admin account
        this.accountActivator(true, index);
    }

    deActivateAdmin(index) {
        //deactivate admin account
        this.accountActivator(false, index);
    }

    componentDidMount() {
        this.loadAdmins();
    }

    render() {
        const { loaded } = this.state;
        const admins = this.props.adminProfiles;
        return (
            <>
                <div className="row mt-5 no-gutters">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col">
                                        <h5>Admins List</h5>
                                    </div>
                                    <div className="col d-flex flex-row-reverse flex-nowrap">
                                        <Link to={createprofileurl + "/1"}>
                                            <FontAwesomeIcon icon="plus-square" />
                                            {' '}
                                            <span>New admin</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {!loaded && (
                                    <Spinner color="secondary" />
                                )}
                                {loaded && (<>
                                    {admins.length === 0 ? <h5>No admin found</h5> : ""}
                                    <div className="row">
                                        {
                                            admins.map((admin, index) => {
                                                return (
                                                    <EachUserCard key={index} index={index + 1}
                                                        firstName={admin.firstName}
                                                        lastName={admin.lastName}
                                                        addr={admin.addr}
                                                        typeName="Admin"
                                                        type={admin.userType}
                                                        active={admin.active}
                                                        activate={() => this.activateAdmin(index)}
                                                        deActivate={() => this.deActivateAdmin(index)} />
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
    adminProfiles: state.adminProfiles
})

const mapDispatchToProps = dispatch => ({
    setProfiles: profiles => dispatch(setAdminsProfiles(profiles))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminList));