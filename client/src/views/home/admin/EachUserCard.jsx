import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editprofileurl } from '../../../utils/constants';

class EachUserCard extends Component {
    render() {
        const { index, active, firstName, lastName, type, typeName, activate, deActivate } = this.props;
        return (
            <div className="col-md-4">
                <div className="card position-rel">
                    {/** Make profile inaccessibe if not active */}
                    {!active && (
                        <div className="inactive-cover position-abs pt-5">
                            <div className="w-100 position-rel justify-content-center">
                                <div className="col-md-6 mx-auto">
                                    <button className="btn btn-primary" onClick={() => activate()}> Activate </button>
                                </div>
                            </div>
                        </div>)
                    }
                    <div className="card-header"> {typeName} - {index} </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">First Name: {firstName}</li>
                        <li className="list-group-item">Last Name: {lastName}</li>
                    </ul>
                    <div className="card-body">
                        {/** Make profile manageable only when still active */}
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Link to={editprofileurl + "/" + type + "/" + (index - 1)}>
                                    <button className="btn btn-dark">
                                        <FontAwesomeIcon icon="edit" />
                                        <span>Edit</span>
                                    </button>
                                </Link>
                            </div>
                            {active && (
                                <div className="p-2">
                                    <button className="btn btn-danger" onClick={() => deActivate()}>
                                        <FontAwesomeIcon icon="cog" />
                                        <span>Deactivate</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default React.memo(EachUserCard);