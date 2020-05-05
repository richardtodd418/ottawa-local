import React from 'react';
import { Banner } from '@shopify/polaris';

const ServerErrors = ({ error }) => {
  if (!error || !error.message) return null;
  const errorMarkup =
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length ? (
      error.networkError.result.errors.map((error, index) => (
        <li key={`error--${index}`}>
          {error.message.replace('GraphQL error: ', '')}
        </li>
      ))
    ) : (
      <li>{error.message.replace('GraphQL error: ', '')}</li>
    );
  return (
    <Banner title="Server error" status="critical">
      <ul>{errorMarkup}</ul>
    </Banner>
  );
};

const ClientErrors = ({ error }) => {
  if (error.length === 0) return null;

  return (
    <Banner
      title={`To add this store, ${error.length} changes need to be made. Please fill out the following fields:`}
      status="critical"
    >
      <ul>
        {error.map((err, index) => (
          <li key={`error-${index}`}>{err}</li>
        ))}
      </ul>
    </Banner>
  );
};

export { ClientErrors, ServerErrors };
