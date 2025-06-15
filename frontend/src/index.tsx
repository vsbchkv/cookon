import React from 'react';

import ReactDOM from 'react-dom/client';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';

import './index.css';
import App from './components/app/App';
import { store } from './utils/store';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Helmet>
        <html lang='en' />
        <title>Welcome to cookON</title>
        <meta name='description' content='cookON react app' />
      </Helmet>
      <App />
    </Provider>
  </React.StrictMode>
);
