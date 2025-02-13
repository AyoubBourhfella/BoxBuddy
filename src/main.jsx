
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import { legacy_createStore } from 'redux';
import Reducer from './store/reducer';

import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';


const store = legacy_createStore(Reducer);

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
      <div className='z-[9999] relative'>
        <Toaster position="top-right" reverseOrder={false} />

      </div>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
