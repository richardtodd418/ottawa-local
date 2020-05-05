import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Layout, FooterHelp, Page, Loading } from '@shopify/polaris';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Stores from './Stores';
import AddStoreForm from './AddStoreForm';
import UpdateStoreForm from './UpdateStoreForm';

import Nav from './Nav';
import '../styles/styles.scss';

const ALL_STORES_QUERY = gql`
  query ALL_STORES_QUERY {
    stores {
      name
      category
      type
      description
      createdAt
      url
      primaryMethod
      methodForm
      methodEmail
      methodPhone
      methodOnline
      image
      invertedImage
      delivery
      pickup
      phone
      email
      id
    }
  }
`;

const App = () => {
  const { loading, error, data, refetch } = useQuery(ALL_STORES_QUERY);

  const filterStores = (storesInput, category) =>
    storesInput.filter((store) => store.category === category);
  if (loading) return <Loading />;
  if (error) return <h1>Error...</h1>;
  const { stores } = data;
  const sortedStores = stores.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    // names must be equal
    return 0;
  });

  const handleRefetch = async () => {
    await refetch();
  };

  const categories = sortedStores.map((store) => store.category);
  const uniqueCategories = [...new Set(categories)];
  return (
    <Router>
      <div>
        <Nav uniqueCategories={uniqueCategories} />

        <Page>
          <Switch>
            {uniqueCategories.map((cat, index) => (
              <Route key={index} path={`/${cat}`}>
                <Stores stores={filterStores(sortedStores, cat)} />
              </Route>
            ))}
            <Route path="/addstore">
              <AddStoreForm handleRefetch={handleRefetch} />
            </Route>
            <Route path="/updatestore/">
              <UpdateStoreForm handleRefetch={handleRefetch} />
            </Route>
            <Route path="/">
              <Stores stores={sortedStores} />
            </Route>
          </Switch>
          <Layout>
            <Layout.Section>
              <FooterHelp>
                This site is for informational purposes and is not affiliated
                with any of the listed merchants.
              </FooterHelp>
            </Layout.Section>
          </Layout>
        </Page>
      </div>
    </Router>
  );
};

export { ALL_STORES_QUERY };
export default App;
