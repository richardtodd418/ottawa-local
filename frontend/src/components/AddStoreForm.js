import React, { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
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
  Banner,
  Spinner,
  Loading,
  Toast,
} from '@shopify/polaris';

import Store from './Store';

const CREATE_STORE_MUTATION = gql`
  mutation CREATE_STORE_MUTATION(
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
    createStore(
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

const AddStoreForm = (props) => {
  // form state
  const [name, updateName] = useState('');
  const [description, updateDescription] = useState('');
  const [category, updateCategory] = useState('');
  const [type, updateType] = useState('');
  const [primaryMethod, updatePrimaryMethod] = useState('');
  const [selectedMethod, updatedSelectedMethod] = useState([]);
  const [delivery, updateDelivery] = useState();
  const [pickup, updatePickup] = useState();
  const [url, updateURL] = useState('https://www.website.com');
  const [email, updateEmail] = useState('');
  const [phone, updatePhone] = useState('');
  const [image, updateImage] = useState('');
  const [invertedImage, updateInvertedImage] = useState(false);
  const [clientErrors, updateClientErrors] = useState([]);
  const [methodForm] = useState(selectedMethod.includes('form'));
  const [methodEmail] = useState(selectedMethod.includes('email'));
  const [methodPhone] = useState(selectedMethod.includes('phone'));
  const [methodOnline] = useState(selectedMethod.includes('online'));
  const [toastActive, setToastActive] = useState(false);

  // mutation state
  const [
    createStore,
    { loading: mutationLoading, error: mutationError, data: mutationData },
  ] = useMutation(CREATE_STORE_MUTATION);

  // validation state
  const [nameError, updateNameError] = useState(false);
  const [categoryError, updateCategoryError] = useState(false);
  const [typeError, updateTypeError] = useState(false);
  const [primaryMethodError, updatePrimaryMethodError] = useState(false);
  const [deliveryError, updateDeliveryError] = useState(false);
  const [pickupError, updatePickupError] = useState(false);
  const [urlError, updateUrlError] = useState(false);

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
    updatePrimaryMethod('');
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
  const handleInvertedImagedChange = useCallback(
    (value) => updateInvertedImage(value),
    [],
  );

  const handleSubmit = async (_event) => {
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
      const store = await createStore({
        variables,
      });
      // reset form fields
      console.log(store.data);
      if (store.data) {
        toggleToastActive();
      }
      clearForm();
    }
  };

  // markup
  const toastMarkup = toastActive ? (
    <Toast content="Store added" onDismiss={toggleToastActive} />
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

  return (
    <Form onSubmit={handleSubmit} implicitSubmit={false}>
      {mutationLoading && <Loading />}
      <FormLayout>
        <ClientErrors error={clientErrors} />
        {mutationError && <ServerErrors error={mutationError} />}
        <Heading>Add a store</Heading>
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
            value={type}
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
              delivery: delivery === 'yes',
              pickup: pickup === 'yes',
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
export default AddStoreForm;
export { CREATE_STORE_MUTATION };
