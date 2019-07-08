import React, { Component } from 'react';

class Footer extends Component
{
    render() {
        return (
        <footer className="d-flex flex-row-reverse flex-nowrap">
            <div className="copyright">
                <h6>© {new Date().getFullYear()} </h6>
            </div>
        </footer>
        );
    }
}

export default Footer;