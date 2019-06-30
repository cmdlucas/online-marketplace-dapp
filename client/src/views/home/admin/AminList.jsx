import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import EachUserCard from './EachUserCard';
import { profilesFetcher } from '../../../utils/dapp/profileWorker';
import { UserType } from '../../../utils/constants/a.constant';

class AdminList extends Component {
    state = { loaded: false, admins: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    editAdminProfile(index, addr) {

    }

    deActivateAdmin(index, addr) {
        // deActivate admin in state for fast response
        const admins = [...this.state.admins];
        admins[index].active = false;
        this.setOwnState({ admins: [...admins] });
        // deActivate admin in storage        
    }

    activateAdmin(index, addr) {

    }

    loadAdmins() {
        profilesFetcher(UserType.Admin).then(admins => {
            //extract admin profiles
            this.setOwnState({ admins: admins, loaded: true })
        }).catch(e => {
            alert(`Failed. Could not fetch admins. See console for error(s).`);
            console.log(e)
        });
    }

    componentDidMount() {
        this.loadAdmins();
    }

    componentDidUpdate() {

    }

    render() {
        const { loaded, admins } = this.state;
        return (
            <>
                <div className="row mt-5 no-gutters">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Admins List</h5>
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
                                                    type="Admin"
                                                    active={admin.active}
                                                    edit={addr => this.editAdminProfile(index, addr)}
                                                    activate={addr => this.activateAdmin(index, addr)}
                                                    deActivate={addr => this.deActivateAdmin(index, addr)} />
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

export default AdminList;