import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { buyproducturl } from '../../../utils/constants';

class EachProductCard extends Component {
    render() {
        const { sfid, pid, name, storeName, price, productQty } = this.props;
        return (
            <div className="col-md-4">
                <div className="card position-rel">
                    {/** Make product inaccessible if not active */}
                    <img className="card-img-top" src="https://via.placeholder.com/50" alt={`Loading ${name}...`} />
                    <div className="card-header"> {name} </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Price: ETH{price}</li>
                        <li className="list-group-item">In Stock: {productQty}</li>
                    </ul>
                    <div className="card-body">
                        {/** Make profile manageable only when still active */}
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Link to={buyproducturl(sfid, storeName, pid)}>
                                    <button className="btn btn-primary">
                                        <FontAwesomeIcon icon="cart-arrow-down" />
                                        {' '}
                                        <span>Buy</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EachProductCard;