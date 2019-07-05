import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { Form, FormGroup, Label, Input,} from 'reactstrap';
import { initialFormInputState } from '../../utils/constants/form.constants';
import { productUpdater } from '../../utils/dapp/productWorker';

class EditProduct extends Component {
    state = {
        formdata: {
            price: {...initialFormInputState},
            qty: {...initialFormInputState},
        }
    }

    setOwnState(state, callback = () => {}) {
        this.setState({ ...this.state, ...state }, callback);
    }

    setFormData(formdata, callback = () => {}) {
        this.setOwnState({ formdata: { ...this.state.formdata, ...formdata }, callback });
    }

    setPrice(val) {
        const value = val >= 0 ? val : -1;
        this.setFormData({
            price: {
                value: value, faulty: value === -1, error: ""
            }
        })
    }

    setQuantity(val) {
        const value = val >= 0 ? val : -1;
        this.setFormData({
            qty: {
                value: value, faulty: value === -1, error: ""
            }
        })
    }

    validated() {
        for(let id in this.state.formdata) {
            if(this.state.formdata[id].value.length === 0) {
                alert(`Invalid ${id} provided`);
                return false;
            }
        }
        return true;
    }

    addProduct() {
        if(this.validated()) {
            const { price, qty } = this.state.formdata;
            const { pid } = this.props.match.params;
            productUpdater({
                price: price.value, qty: qty.value, pid: pid
            }).then(() => {
                window.location.assign("/");
            }).catch(e => {
                alert(`Sorry. We couldn't edit product. See console for error(s)`);
                console.log(e);
            })
        }
    }

    render() {
        return (
            <WorkModalMaster title={`Edit Product`} actionTitle="Proceed" actionDoer={() => this.addProduct()}>    
                <Form onSubmit={e=>{e.preventDefault(); this.addProduct(); return false;}}>
                    <FormGroup>
                        <Label for="price">Price</Label>
                        <Input type="number" min="0" name="price" id="price"
                            onChange={e => this.setPrice(e.target.value)} placeholder="Enter product's price" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="qty">Quantity</Label>
                        <Input type="number" min="0" name="qty" id="qty"
                            onChange={e => this.setQuantity(e.target.value)} placeholder="Enter product's quantity" />
                    </FormGroup>
                </Form>
            </WorkModalMaster>
        )
    }
}

const mapStateToProps = state => ({
    products: state.products
})

const mapDispatchToProps = dispatch => ({

})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditProduct));