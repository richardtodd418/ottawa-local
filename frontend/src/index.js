import React from 'react';
import { render } from 'react-dom';
import '@shopify/polaris/styles.css';
import { AppProvider, Frame } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import client from './lib/withData';
import { gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import App from './components/App';

function WrappedApp() {
  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <App />
      </Frame>
    </AppProvider>
  );
}

const rootElement = document.getElementById('root');
render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <WrappedApp />
    </React.StrictMode>
  </ApolloProvider>,
  rootElement,
);
