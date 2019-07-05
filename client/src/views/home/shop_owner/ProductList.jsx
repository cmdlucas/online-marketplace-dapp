import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { productsFetcher, productActivator } from '../../../utils/dapp/productWorker';
import EachProductCard from './EachProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setProducts } from '../../../model/redux/action/products';
import { createproducturl } from '../../../utils/constants';

class ProductList extends Component
{
    state = { loaded: false, products: [] };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadProducts() {
        const { sfid } = this.props.match.params;
        productsFetcher(sfid).then(products => {
            //set admin profiles globally
            this.setOwnState({ loaded: true });
            this.props.setProducts(products || []);
        }).catch(e => {
            alert(`Failed. Could not fetch products. See console for error(s).`);
            console.log(e)
        });
    }

    productActivator(active, index) {
        // perform activation action on product in global state for faster UI response
        const products = this.props.products;
        products[index].active = active;
        this.props.setProducts(products);
        // deactivate product in storage
        productActivator(products[index].pid, active).catch(e => {
            console.log(e);
            alert(`Failed. Couldn't ${active ? "activate" : "deactivate"} product. See console for error(s). Reverting changes...`);
            products[index].active = !active;
            this.props.setProducts(products);
        });        
    }

    activateProduct(index) {
        //activate admin account
        this.productActivator(true, index);
    }

    deActivateProduct(index) {
        //deactivate admin account
        this.productActivator(false, index);
    }

    componentDidMount() {
        this.loadProducts();
    }

    render() {
        const { loaded } = this.state;
        const { products, match: {params : {sfid, name} } } = this.props;
        return (
            <div className="row mt-5 no-gutters">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5>Products List - {name} </h5>
                                </div>
                                {
                                    name && (
                                        <div className="col d-flex flex-row-reverse flex-nowrap">
                                            <Link to={createproducturl(sfid, name)}>
                                                <FontAwesomeIcon icon="plus-square" />
                                                {' '}
                                                <span>New product</span>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="card-body">
                            {!loaded && (
                                <Spinner color="secondary" />
                            )}
                            {loaded && (<>
                                {products.length === 0 ? <h5>No products found</h5> : ""}
                                <div className="row">
                                    {
                                        products.map((product, index) => {
                                            return (
                                                <EachProductCard key={index} index={index + 1}
                                                    sfid={sfid}
                                                    price={product.price}
                                                    name={product.name}
                                                    productQty={product.productQty}
                                                    active={product.active}
                                                    activate={() => this.activateProduct(index)}
                                                    deActivate={() => this.deActivateProduct(index)} />
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
    products: state.products
})

const mapDispatchToProps = dispatch => ({
    setProducts: products => dispatch(setProducts(products))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);