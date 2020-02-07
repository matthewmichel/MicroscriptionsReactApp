import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MainMenu from './MainMenu';
import * as serviceWorker from './serviceWorker';
import Login from './Login/Login'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
    <div className="masterDiv">
        <Router>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </Router>

    </div>


    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
