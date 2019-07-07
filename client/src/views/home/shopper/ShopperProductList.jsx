import React, { Component } from 'react';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import { productsFetcher } from '../../../utils/dapp/productWorker';
import ShopperProductCard from './ShopperProductCard';
import { setProducts } from '../../../model/redux/action/products';

class ShopperProductList extends Component
{
    state = { loaded: false };

    setOwnState(state, callback = () => { }) {
        this.setState({ ...this.state, ...state }, callback);
    }

    loadProducts() {
        const { sfid } = this.props.match.params;
        productsFetcher(sfid).then(products => {
            // set admin profiles globally
            this.setOwnState({ loaded: true });
            this.props.setProducts(products || []);
        }).catch(e => {
            alert(`Failed. Could not fetch products. See console for error(s).`);
            console.log(e)
        });
    }

    componentDidMount() {
        this.loadProducts();
    }

    render() {
        const { loaded } = this.state;
        const { products, match: { params : {sfid, name} } } = this.props;
        return (
            <div className="row mt-5 no-gutters">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col">
                                    <h5>Products List - {name} </h5>
                                </div>
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
                                                <ShopperProductCard key={index} index={index + 1}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopperProductList);