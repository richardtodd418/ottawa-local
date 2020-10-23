import React, { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useLocation, Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Select,
  ChoiceList,
  Checkbox,
  Heading,
  Spinner,
  Loading,
  Toast,
} from '@shopify/polaris';

import { ClientErrors, ServerErrors } from './Errors';

import Store from './Store';

const SINGLE_STORE_QUERY = gql`
  query SINGLE_STORE_QUERY($id: ID!) {
    store(where: { id: $id }) {
      id
      name
      category
      type
      url
      primaryMethod
      methodOnline
      methodForm
      methodEmail
      methodPhone
      email
      phone
      description
      delivery
      pickup
      invertedImage
      image
    }
  }
`;

const UPDATE_STORE_MUTATION = gql`
  mutation UPDATE_STORE_MUTATION(
    $id: ID!
    $name: String!
    $category: String!
    $type: String!
    $url: String!
    $primaryMethod: String!
    $methodPhone: Boolean!
    $methodOnline: Boolean!
    $methodForm: Boolean!
    $methodEmail: Boolean!
    $email: String
    $phone: String
    $description: String
    $delivery: Boolean!
    $pickup: Boolean!
    $invertedImage: Boolean!
    $image: String
  ) {
    updateStore(
      id: $id
      name: $name
      category: $category
      type: $type
      url: $url
      primaryMethod: $primaryMethod
      methodOnline: $methodOnline
      methodForm: $methodForm
      methodEmail: $methodEmail
      methodPhone: $methodPhone
      email: $email
      phone: $phone
      description: $description
      delivery: $delivery
      pickup: $pickup
      invertedImage: $invertedImage
      image: $image
    ) {
      id
    }
  }
`;

const UpdateStoreFormInner = ({ queryData, source, handleRefetch }) => {
  const storeData = queryData.store;

  // gql
  const [
    updateStore,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(UPDATE_STORE_MUTATION);

  const getString = (bool) => {
    if (bool) return 'yes';
    return 'no';
  };

  const queryShoppingMethods = ({ store }) => {
    const methods = {
      methodOnline: 'online',
      methodForm: 'form',
      methodPhone: 'phone',
      methodEmail: 'email',
    };
    const methodArray = [];
    for (const [key, value] of Object.entries(methods)) {
      if (store[key]) {
        methodArray.push(methods[key]);
      }
    }
    return methodArray;
  };
  const availableMethods = queryShoppingMethods(queryData);

  // form state
  const [name, updateName] = useState(storeData.name);
  const [description, updateDescription] = useState(storeData.description);
  const [category, updateCategory] = useState(storeData.category);
  const [type, updateType] = useState(storeData.type);
  const [primaryMethod, updatePrimaryMethod] = useState(
    storeData.primaryMethod,
  );
  const [selectedMethod, updatedSelectedMethod] = useState(availableMethods);
  const [delivery, updateDelivery] = useState(getString(storeData.delivery));
  const [pickup, updatePickup] = useState(getString(storeData.pickup));
  const [url, updateURL] = useState(storeData.url);
  const [email, updateEmail] = useState(storeData.email);
  const [phone, updatePhone] = useState(storeData.phone);
  const [image, updateImage] = useState(storeData.image);
  const [invertedImage, updateInvertedImage] = useState(
    storeData.invertedImage,
  );
  const [clientErrors, updateClientErrors] = useState([]);
  const [methodForm] = useState(selectedMethod.includes('form'));
  const [methodEmail] = useState(selectedMethod.includes('email'));
  const [methodPhone] = useState(selectedMethod.includes('phone'));
  const [methodOnline] = useState(selectedMethod.includes('online'));
  const [toastActive, setToastActive] = useState(false);

  // validation state
  const [nameError, updateNameError] = useState(false);
  const [categoryError, updateCategoryError] = useState(false);
  const [typeError, updateTypeError] = useState(false);
  const [primaryMethodError, updatePrimaryMethodError] = useState(false);
  const [deliveryError, updateDeliveryError] = useState(false);
  const [pickupError, updatePickupError] = useState(false);
  const [urlError, updateUrlError] = useState(false);
  const [submitted, updateSubmitted] = useState(false);

  // options
  const categoryOptions = [
    { label: 'Groceries', value: 'groceries' },
    { label: 'Alcohol', value: 'alcohol' },
    { label: 'Restaurants', value: 'restaurants' },
  ];

  const typesObject = {
    alcohol: [
      { label: 'Beer', value: 'beer' },
      { label: 'Cider', value: 'cider' },
      { label: 'Liquour', value: 'liqour' },
      { label: 'Wine', value: 'wine' },
    ],
    groceries: [
      { label: 'Bakery', value: 'bakery' },
      { label: 'Baking', value: 'baking' },
      { label: 'Chocolate', value: 'chocolate' },
      { label: 'Coffee', value: 'coffee' },
      { label: 'Dairy', value: 'dairy' },
      { label: 'Deli', value: 'deli' },
      { label: 'Desserts', value: 'desserts' },
      { label: 'Fruit', value: 'fruit' },
      { label: 'Ice cream', value: 'ice cream' },
      { label: 'Groceries', value: 'Groceries' },
      { label: 'Meat', value: 'meat' },
      { label: 'Produce', value: 'produce' },
      { label: 'Sauces', value: 'sauces' },
      { label: 'Soups', value: 'soups' },
      { label: 'Tea', value: 'tea' },
    ],
    restaurants: [
      { label: 'Indian', value: 'indian' },
      { label: 'Italian', value: 'italian' },
      { label: 'Thai', value: 'thai' },
    ],
  };

  const typeOptions = typesObject[category];

  const primaryMethodOptions = [
    { label: 'Email', value: 'email' },
    { label: 'Form', value: 'form' },
    { label: 'Online', value: 'online' },
    { label: 'Phone', value: 'phone' },
  ];

  const shippingOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // helpers
  const clearForm = () => {
    updateName('');
    updateDescription('');
    updateCategory('');
    updateType('');
    updatePrimaryMethod();
    updatedSelectedMethod([]);
    updateDelivery();
    updatePickup();
    updateURL('');
    updateEmail('');
    updatePhone('');
    updateImage('');
    updateInvertedImage(false);
  };

  // handlers
  const toggleToastActive = useCallback(
    () => setToastActive((active) => !active),
    [],
  );

  const validateOnChange = (updater, value) => {
    if (value.trim().length > 0) {
      updater(false);
    }
  };

  const handleNameChange = useCallback((value) => {
    updateName(value);
    validateOnChange(updateNameError, value);
  }, []);

  const handleDescriptionChange = useCallback(
    (value) => updateDescription(value),
    [],
  );

  const handleCategorySelectChange = useCallback(
    (value) => {
      updateCategory(value);
      updateType('');
      validateOnChange(updateCategoryError, value);
      validateOnChange(updateTypeError, value);
    },

    [],
  );

  const handleTypeChange = useCallback((value) => {
    updateType(value);
    validateOnChange(updateTypeError, value);
  }, []);

  const handlePrimaryMethodSelectChange = useCallback((value) => {
    updatePrimaryMethod(value);
    validateOnChange(updatePrimaryMethodError, value);
  }, []);
  const handleMethodChange = useCallback(
    (value) => updatedSelectedMethod(value),
    [],
  );

  const handleDeliverySelectChange = useCallback((value) => {
    updateDelivery(value);
    validateOnChange(updateDeliveryError, value);
  }, []);

  const handlePickupSelectChange = useCallback((value) => {
    updatePickup(value);
    validateOnChange(updatePickupError, value);
  }, []);
  const handleURLChange = useCallback((value) => {
    updateURL(value);
    validateOnChange(updateUrlError, value);
  }, []);
  const handleEmailChange = useCallback((value) => updateEmail(value), []);
  const handlePhoneChange = useCallback((value) => updatePhone(value), []);
  const handleImageChange = useCallback((value) => updateImage(value), []);
  const handleInvertedImagedChange = useCallback((value) => {
    updateInvertedImage(value);
  }, []);

  const handleSubmit = async () => {
    // XXX Need to just submit changes fields, so need to compare the query data to the current state of the fields and only submit those that are different

    // check for required fields
    const required = {
      name,
      category,
      type,
      primaryMethod,
      delivery,
      pickup,
      url,
    };
    const errorArray = [];

    const errorTitles = {
      name: 'Store name',
      category: 'Store category',
      type: 'Store type',
      primaryMethod: 'Primary shopping method',
      delivery: 'Home delivery',
      pickup: 'Curbside pickup',
      url: 'Website URL',
    };

    const inlineErrorUpdaters = {
      name: updateNameError,
      category: updateCategoryError,
      type: updateTypeError,
      primaryMethod: updatePrimaryMethodError,
      delivery: updateDeliveryError,
      pickup: updatePickupError,
      url: updateUrlError,
    };

    for (const property in required) {
      if (required[property] == null || required[property] === '') {
        // create array of fields with errors
        errorArray.push(errorTitles[property]);
        // update inline errors for required fields
        if (inlineErrorUpdaters[property] != null) {
          inlineErrorUpdaters[property](true);
        }
      }
    }
    const variables = {
      id: storeData.id,
      name,
      category,
      type,
      url,
      primaryMethod,
      methodOnline,
      methodForm,
      methodEmail,
      methodPhone,
      email,
      phone,
      description,
      delivery: delivery === 'yes',
      pickup: pickup === 'yes',
      invertedImage,
      image,
    };

    updateClientErrors(errorArray);

    if (errorArray.length === 0) {
      const store = await updateStore({
        variables,
      });
      // reset form fields
      if (store.data) {
        handleRefetch();
        toggleToastActive();
      }
      clearForm();
    }
  };

  // markup
  const toastMarkup = toastActive ? (
    <Toast
      duration={2000}
      content="Store updated"
      onDismiss={() => {
        toggleToastActive();
        updateSubmitted(true);
      }}
    />
  ) : null;

  // validation
  const validateOnBlur = (value, errorUpdater) => {
    // check if name is valid
    if (!value || value.trim().length === 0) {
      errorUpdater(true);
    } else {
      errorUpdater(false);
    }
  };

  if (submitted)
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { source },
        }}
      />
    );
  // XXX add spinner or other loading indicator
  return (
    <Form onSubmit={handleSubmit} implicitSubmit={false}>
      {mutationLoading && <Loading />}
      <FormLayout>
        <ClientErrors error={clientErrors} />
        {mutationError && <ServerErrors error={mutationError} />}
        <span className="Form-Heading--Wrapper">
          <Heading>Edit store</Heading>
        </span>
        <TextField
          label="Store name"
          onChange={handleNameChange}
          value={name}
          type="text"
          placeholder="Store name"
          labelHidden
          required
          id="storeName"
          error={nameError ? 'Store name is required' : ''}
          onBlur={() => validateOnBlur(name, updateNameError)}
        />

        <TextField
          label="Description"
          onChange={handleDescriptionChange}
          value={description}
          type="text"
          multiline={3}
          placeholder="Enter a short description of the store (optional)"
          labelHidden
        />
        <FormLayout.Group>
          <Select
            label="Store category"
            options={categoryOptions}
            onChange={handleCategorySelectChange}
            value={category}
            placeholder="Choose store category"
            error={categoryError ? 'Category is required' : ''}
            onBlur={() => validateOnBlur(category, updateCategoryError)}
          />
          <Select
            label="Store type"
            options={typeOptions}
            onChange={handleTypeChange}
            value={type.toLowerCase()}
            placeholder="Choose store type"
            error={typeError ? 'Type is required' : ''}
            onBlur={() => validateOnBlur(type, updateTypeError)}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Select
            label="Primary shopping method"
            options={primaryMethodOptions}
            onChange={handlePrimaryMethodSelectChange}
            value={primaryMethod}
            placeholder="Choose the primary shopping method"
            error={
              primaryMethodError ? 'Primary shpping method is required' : ''
            }
            onBlur={() =>
              validateOnBlur(primaryMethod, updatePrimaryMethodError)
            }
          />

          <ChoiceList
            allowMultiple
            title="Available shopping methods"
            choices={primaryMethodOptions}
            selected={selectedMethod}
            onChange={handleMethodChange}
          />
        </FormLayout.Group>

        <FormLayout.Group>
          <Select
            label="Home delivery"
            options={shippingOptions}
            onChange={handleDeliverySelectChange}
            value={delivery}
            placeholder="Make a selection"
            error={deliveryError ? 'Delivery availabilty required' : ''}
            onBlur={() => validateOnBlur(delivery, updateDeliveryError)}
          />
          <Select
            label="Curbside pickup"
            options={shippingOptions}
            onChange={handlePickupSelectChange}
            value={pickup}
            placeholder="Make a selection"
            error={pickupError ? 'Pickup availabilty required' : ''}
            onBlur={() => validateOnBlur(pickup, updatePickupError)}
          />
        </FormLayout.Group>
        <TextField
          label="URL"
          onChange={handleURLChange}
          value={url}
          type="url"
          placeholder="Website URL"
          labelHidden
          error={urlError ? 'Website URL required' : ''}
          onBlur={() => validateOnBlur(url, updateUrlError)}
        />
        <FormLayout.Group>
          <TextField
            label="Email"
            onChange={handleEmailChange}
            value={email}
            type="email"
            placeholder="Store email address (optional)"
            labelHidden
          />
          <TextField
            label="Phone number"
            onChange={handlePhoneChange}
            value={phone}
            type="tel"
            placeholder="Store phone number (optional)"
            labelHidden
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <TextField
            label="Image URL"
            onChange={handleImageChange}
            value={image}
            type="text"
            placeholder="Store logo url (optional)"
            labelHidden
            helpText="Enter the URL of the image to use as the store logo"
          />
          <Checkbox
            label="Inverted image"
            checked={invertedImage}
            onChange={handleInvertedImagedChange}
            helpText="Check if the logo image uses a white image on a transparent background"
          />
        </FormLayout.Group>
        <Button
          primary
          submit
          disabled={mutationLoading}
          aria-busy={mutationLoading}
        >
          {mutationLoading ? (
            <Spinner
              accessibilityLabel="Spinner example"
              size="small"
              color="teal"
            />
          ) : (
            'Submit'
          )}
        </Button>
      </FormLayout>

      <FormLayout.Group>
        <span />
        <>
          <Heading>Preview</Heading>
          <Store
            store={{
              name,
              category,
              type,
              description,
              url,
              primaryMethod,
              methodOnline,
              methodForm,
              methodEmail,
              methodPhone,
              image,
              invertedImage,
              delivery,
              pickup,
              phone,
              email,
            }}
          />
        </>
        <span />
      </FormLayout.Group>
      {toastMarkup}
    </Form>
  );
};

const UpdateStoreForm = ({ handleRefetch }) => {
  // route state
  const location = useLocation();
  const { storeId } = location.state;

  // get store from DB (alterative is to use state)
  const { loading: queryLoading, data: queryData } = useQuery(
    SINGLE_STORE_QUERY,
    {
      variables: { id: storeId },
    },
  );

  if (queryLoading) return <Loading />;
  return (
    <UpdateStoreFormInner
      queryData={queryData}
      source={location.pathname}
      handleRefetch={handleRefetch}
    />
  );
};

export default UpdateStoreForm;
export { UPDATE_STORE_MUTATION };
