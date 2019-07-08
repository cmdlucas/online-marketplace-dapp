import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { withdrawFunds } from '../../utils/dapp/accountWorker';

class WithdrawFunds extends Component {
    state = {
        amt: 1
    }

    setAmount(amt) {
        this.setState({
            ...this.state, amt: amt            
        })
    }

    withdraw() {
        withdrawFunds(this.state.amt)
            .then(() => {
                this.props.toggle();
                window.location.reload();
            }).catch(e => {
                alert(`Sorry. We couldn't withdraw your funds for you. See console for error(s)`);
                console.log(e);
            })
    }

    render() {
        const { max, modal, toggle } = this.props;
        return (
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Withdraw Fund</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => { e.preventDefault(); this.withdraw(); return false; }}>
                        <FormGroup>
                            <Label for="amt">Amount</Label>
                            <Input type="number" min="0" max={max} name="amt" id="amt" defaultValue="1"
                                onChange={e => this.setAmount(e.target.value)} placeholder="Enter product's price" />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.withdraw()}>Proceed</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default WithdrawFunds;