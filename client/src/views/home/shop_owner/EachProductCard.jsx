import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editproducturl } from '../../../utils/constants';

class EachProductCard extends Component {
    render() {
        const { index, sfid, active, name, price, productQty, activate, deActivate } = this.props;
        return (
            <div className="col-md-4">
                <div className="card position-rel">
                    {/** Make product inaccessible if not active */}
                    {!active && (
                        <div className="inactive-cover position-abs pt-5">
                            <div className="w-100 position-rel justify-content-center">
                                <div className="col-md-6 mx-auto">
                                    <button className="btn btn-primary" onClick={() => activate()}> Activate </button>
                                </div>
                            </div>
                        </div>)
                    }
                    <img className="card-img-top" src="https://via.placeholder.com/50" alt={name} />
                    <div className="card-header"> {name} </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Price: ${price}</li>
                        <li className="list-group-item">Quantity: {productQty}</li>
                    </ul>
                    <div className="card-body">
                        {/** Make profile manageable only when still active */}
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Link to={editproducturl(sfid, name, index - 1)}>
                                    <button className="btn btn-dark">
                                        <FontAwesomeIcon icon="edit" />
                                        {' '}
                                        <span>Edit</span>
                                    </button>
                                </Link>
                            </div>
                            <div className="p-2">
                                <button className="btn btn-danger" onClick={() => deActivate()}>
                                    <FontAwesomeIcon icon="cog" />
                                    {' '}
                                    <span>Deactivate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EachProductCard;