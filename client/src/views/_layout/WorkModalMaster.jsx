import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class WorkModalMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.props.history.replace(this.props.prevUrl);
    }

    render() {
        const { title, actionTitle, actionColor, actionDoer } = this.props;
        return (
            <div>
                <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                    <ModalBody>{this.props.children}</ModalBody>
                    <ModalFooter>
                        <Button color={actionColor || "primary"} onClick={actionDoer}>{actionTitle}</Button>
                        {' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withRouter(WorkModalMaster);