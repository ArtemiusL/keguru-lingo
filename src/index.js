import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js';
import 'custom-event-polyfill';
import moment from 'moment';
import 'moment/locale/ru';

import '@styles/reset.css';
import '@styles/global';
// import route
import App from './App';

// config
import './common/config/api';

moment.locale('ru');

ReactDOM.render(<App />, document.getElementById('root'));
