import React from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './utils/store';
import './index.css';

import App from './components/app/App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Helmet>
        <html lang="en" />
        <title>Welcome to cookON</title>
        <meta name="description" content="cookON react app" />
      </Helmet>
      <App />
    </Provider>
  </React.StrictMode>
);
