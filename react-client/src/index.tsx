import React from 'react';
import ReactDOM from 'react-dom';

// Styles
import './styles/reset.css';
import './styles/ext-fonts.css';

// Components
import { App } from './components/App';

// Workers
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
