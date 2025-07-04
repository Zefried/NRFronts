import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios';

// These links are important to make the bootstrap template work smoothly
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/css/sb-admin-2.min.css';
import '../src/assets/vendor/fontawesome-free/css/all.min.css';
import './assets/vendor/jquery/jquery.min.js';
import './assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import './assets/vendor/jquery-easing/jquery.easing.min.js';
import './assets/js/sb-admin-2.min.js';
// ends here

axios.defaults.baseURL = 'http://127.0.0.1:8000/';

// axios.defaults.baseURL = 'https://nrserver.sbs/'





createRoot(document.getElementById('root')).render(

  <StrictMode>
    <App />
  </StrictMode>,
)
