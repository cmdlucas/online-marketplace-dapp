import React, { Component } from 'react';

class Header extends Component
{
    render() {
        return (<>
        <header className="d-flex flex-nowrap flex-row mb-5">
            <div className="logo pt-3 pb-2">
                <h4>Online Marketplace dApp</h4>
            </div>
        </header>
        </>);
    }
}

export default Header;