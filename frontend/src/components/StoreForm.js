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
    <Banner
      title='High risk of fraud detected'
      action={{ content: 'Review risk analysis' }}
      status='critical'
    >
      <ul>{errorMarkup}</ul>
    </Banner>
  );
};

const ClientErrors = ({ error }) => {
  if (error.length === 0) return null;

  return (
    <Banner
      title={`To add this store, ${error.length} changes need to be made. Please fill out the following fields:`}
      status='critical'
    >
      <ul>
        {error.map((err, index) => (
          <li key={`error-${index}`}>{err}</li>
        ))}
      </ul>
    </Banner>
  );
};

const StoreForm = (props) => {
  const [name, updateName] = useState();
  const [category, updateCategory] = useState();
  const [type, updateType] = useState();
  const [url, updateURL] = useState();
  const [primaryMethod, updatePrimaryMethod] = useState();
  const [selectedMethod, updatedSelectedMethod] = useState([]);
  const [email, updateEmail] = useState('');
  const [phone, updatePhone] = useState('');
  const [description, updateDescription] = useState('');
  const [delivery, updateDelivery] = useState();
  const [pickup, updatePickup] = useState();
  const [invertedImage, updateInvertedImage] = useState(false);
  const [image, updateImage] = useState('');
  const [clientErrors, updateClientErrors] = useState([]);

  const [methodForm] = useState(selectedMethod.includes('form'));
  const [methodEmail] = useState(selectedMethod.includes('email'));
  const [methodPhone] = useState(selectedMethod.includes('phone'));
  const [methodOnline] = useState(selectedMethod.includes('online'));
  const [
    createStore,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(CREATE_STORE_MUTATION);

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

  // handlers

  const handleSubmit = (_event) => {
    // handle submission

    // check for require fields
    const required = {
      name,
      category,
      type,
      primaryMethod,
      delivery,
      pickup,
      url,
    };
    let errorArray = [];

    const errorTitles = {
      name: 'Store name',
      category: 'Store category',
      type: 'Store Type',
      primaryMethod: 'Primary shopping method',
      delivery: 'Home delivery',
      pickup: 'Curbside pickup',
      url: 'Website URL',
    };

    for (const property in required) {
      if (required[property] == null || required[property] === '') {
        errorArray.push(errorTitles[property]);
      }
    }

    if (errorArray.length === 0) {
      createStore({
        variables: {
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
          delivery,
          pickup,
          invertedImage,
          image,
        },
      });
    } else {
      updateClientErrors(errorArray);
    }
  };
  const handleNameChange = useCallback((value) => updateName(value), [name]);
  const handleDescriptionChange = useCallback(
    (value) => updateDescription(value),
    [],
  );

  const handleCategorySelectChange = useCallback(
    (value) => {
      updateCategory(value);
      updateType('');
    },

    [],
  );
  const handleTypeChange = useCallback((value) => updateType(value), []);
  const handleURLChange = useCallback((value) => updateURL(value), []);
  const handlePrimaryMethodSelectChange = useCallback(
    (value) => updatePrimaryMethod(value),
    [],
  );
  const handleMethodChange = useCallback(
    (value) => updatedSelectedMethod(value),
    [],
  );

  const handleDeliverySelectChange = useCallback(
    (value) => updateDelivery(value),
    [],
  );

  const handlePickupSelectChange = useCallback(
    (value) => updatePickup(value),
    [],
  );

  const handleEmailChange = useCallback((value) => updateEmail(value), []);
  const handlePhoneChange = useCallback((value) => updatePhone(value), []);
  const handleImageChange = useCallback((value) => updateImage(value), []);
  const handleInvertedImagedChange = useCallback(
    (value) => updateInvertedImage(value),
    [],
  );

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {mutationLoading && <Loading />}
        <FormLayout>
          <ServerErrors error={mutationError} />
          <ClientErrors error={clientErrors} />
          <Heading>Add a store</Heading>
          <TextField
            label='Store name'
            onChange={handleNameChange}
            value={name}
            type='text'
            placeholder='Store name'
            labelHidden
            required
          />
          <TextField
            label='Description'
            onChange={handleDescriptionChange}
            value={description}
            type='text'
            multiline={3}
            placeholder='Enter a short description of the store (optional)'
            labelHidden
          />
          <FormLayout.Group>
            <Select
              label='Category'
              options={categoryOptions}
              onChange={handleCategorySelectChange}
              value={category}
              placeholder='Choose store category'
              labelHidden
            />
            <Select
              label='Tags'
              options={typeOptions}
              onChange={handleTypeChange}
              value={type}
              labelHidden
              placeholder='Choose store type'
            />
          </FormLayout.Group>
          <Select
            label='Primary method'
            options={primaryMethodOptions}
            onChange={handlePrimaryMethodSelectChange}
            value={primaryMethod}
            placeholder='Choose the primary shopping method'
            labelHidden
          />
          <ChoiceList
            allowMultiple
            title='Available shopping methods'
            choices={primaryMethodOptions}
            selected={selectedMethod}
            onChange={handleMethodChange}
          />
          <FormLayout.Group>
            <Select
              label='Delivery'
              options={shippingOptions}
              onChange={handleDeliverySelectChange}
              value={delivery}
              placeholder='Home delivery'
              labelHidden
            />
            <Select
              label='Pickup'
              options={shippingOptions}
              onChange={handlePickupSelectChange}
              value={pickup}
              placeholder='Curbside pickup'
              labelHidden
              required
            />
          </FormLayout.Group>
          <TextField
            label='URL'
            onChange={handleURLChange}
            value={url}
            type='text'
            placeholder='Website URL'
            labelHidden
          />
          <FormLayout.Group>
            <TextField
              label='Email'
              onChange={handleEmailChange}
              value={email}
              type='email'
              placeholder='Store email address (optional)'
              labelHidden
            />
            <TextField
              label='Phone number'
              onChange={handlePhoneChange}
              value={phone}
              type='text'
              placeholder='Store phone number (optional)'
              labelHidden
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField
              label='Image URL'
              onChange={handleImageChange}
              value={image}
              type='text'
              placeholder='Store logo url (optional)'
              labelHidden
              helpText='Enter the URL of the image to use as the store logo'
            />
            <Checkbox
              label='Inverted image'
              checked={invertedImage}
              onChange={handleInvertedImagedChange}
              helpText='Check if the logo image uses a white image on a transparent background'
            />
          </FormLayout.Group>
          <Button submit disabled={mutationLoading} aria-busy={mutationLoading}>
            {mutationLoading ? (
              <Spinner
                accessibilityLabel='Spinner example'
                size='small'
                color='teal'
              />
            ) : (
              'Submit'
            )}
          </Button>
        </FormLayout>

        <FormLayout.Group>
          <span></span>
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
          <span></span>
        </FormLayout.Group>
      </Form>
    </>
  );
};
export default StoreForm;
