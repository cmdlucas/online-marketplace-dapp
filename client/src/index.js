import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';

import store from './model/redux-store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faEdit, faPlusSquare, faSearch, faCartArrowDown } from '@fortawesome/free-solid-svg-icons'

import 'bootstrap/dist/css/bootstrap.min.css';
import "./_assets/css/general.css";

// Load Font Awesome Icons
library.add(faCog, faEdit, faPlusSquare, faSearch, faCartArrowDown);

// Render application
ReactDOM.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
