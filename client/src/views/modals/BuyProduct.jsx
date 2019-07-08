import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkModalMaster from '../_layout/WorkModalMaster';
import { Form, FormGroup, Label, Input,} from 'reactstrap';
import { productsPurchaser } from '../../utils/dapp/shopperActionsWorker';
import { storefronturl } from '../../utils/constants';

class BuyProduct extends Component {
    state = {
        formdata: {
            qty: { value: 1, faulty: false, error: "" },
        }
    }

    setOwnState(state, callback = () => {}) {
        this.setState({ ...this.state, ...state }, callback);
    }

    setFormData(formdata, callback = () => {}) {
        this.setOwnState({ formdata: { ...this.state.formdata, ...formdata }, callback });
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

    buyProduct() {
        if(this.validated()) {
            const { qty } = this.state.formdata;
            const { pid, sfid, name } = this.props.match.params;
            productsPurchaser({ 
                pid, sfid, qty: qty.value
            }).then(() => {
                const url = storefronturl(sfid, name);
                this.props.history.replace(url);
                window.location.reload();
            }).catch(e => {
                alert(`Sorry. We couldn't purchase this product. See console for error(s)`);
                console.log(e);
            })
        }
    }

    render() {
        return (
            <WorkModalMaster title={`Buy Product`} actionTitle="Proceed" actionDoer={() => this.buyProduct()}>    
                <Form onSubmit={e=>{e.preventDefault(); this.buyProduct(); return false;}}>
                    <FormGroup>
                        <Label for="qty">Quantity</Label>
                        <Input type="number" min="1" name="qty" id="qty" defaultValue={1}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyProduct));