import React from 'react';
import { Spinner, Button, Alert } from 'reactstrap';

const spinnerSize = { width: "5rem", height: "5rem"};

//situation presenter for dApp provisioning
const PreLoad = ({ dAppLoading, dAppInitFailed, reloader, error }) => {
    return (
        <div className="text-center mt-5 pt-5">
            {
                dAppLoading ? (
                    <>
                        <Spinner type="grow" color="warning" style={spinnerSize}/>
                        <p>Provisioning Marketplace</p>
                    </>) : ""
            }

            {
                dAppInitFailed ? (
                    <>
                        <Alert color="danger" className="col-sm-5 mx-auto">{error}</Alert>
                        <Button color="primary" onClick={reloader}> Reload </Button>
                    </>) : ""
            }
        </div>
    )
}

export default React.memo(PreLoad);