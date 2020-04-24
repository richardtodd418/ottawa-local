import React, { useState } from 'react';
import { Layout, Page, FooterHelp } from '@shopify/polaris';
import Store from './Store';

const Stores = (props) => {
  const [catStores] = useState(props.stores);
  return (
      <Layout>
        {catStores.map((store, index) => (
          <Store key={`store--${index}`} store={store} />
        ))}
      </Layout>
  );
};

export default Stores;
