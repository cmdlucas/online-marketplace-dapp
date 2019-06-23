import React, { Component } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';

class Master extends Component
{
    render() {
        return (
            <>
                <Header />
                {this.props.children}
                <Footer />
            </>
        )
    }
}

export default Master;