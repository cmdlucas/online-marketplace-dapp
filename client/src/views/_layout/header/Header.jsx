import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (<>
            <header className="d-flex flex-nowrap flex-row mb-5">
                <div className="logo pt-3 pb-2">
                    <h4><Link to="/">Online Marketplace dApp</Link></h4>
                </div>
            </header>
        </>);
    }
}

export default Header;