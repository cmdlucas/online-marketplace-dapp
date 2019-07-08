import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { storefronturl } from '../../../utils/constants';

class ShopperStoreFrontCard extends Component {
    render() {
        const { index, name, productQty } = this.props;
        return (
            <div className="col-md-4">
                <div className="card position-rel">
                    <div className="card-header">
                        <h5>{name}</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Products in store: {productQty}</li>
                    </ul>
                    <div className="card-body">
                        <div className="d-flex flex-row">
                            <div className="p-2">
                                <Link to={storefronturl(index - 1, name)}>
                                    <button className="btn btn-primary">
                                        <FontAwesomeIcon icon="search" />
                                        {' '}
                                        <span>Explore</span>
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

export default ShopperStoreFrontCard;