import React, { useCallback, useState } from 'react';
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Select,
  ChoiceList,
} from '@shopify/polaris';

const StoreForm = (props) => {
  const [name, updateName] = useState('');
  const [description, updateDescription] = useState('');
  const [category, updateCategory] = useState('');
  const [type, updateType] = useState('');
  const [url, updateURL] = useState('');
  const [primaryMethod, updatePrimaryMethod] = useState('');
  const [selectedMethod, updatedSelectedMethod] = useState(['']);


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

  // handlers
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
  return (
    <Form>
      <FormLayout>
        <TextField
          label='Store name'
          onChange={handleNameChange}
          value={name}
          type='text'
          placeholder='Business name'
          labelHidden
        />
        <TextField
          label='Description'
          onChange={handleDescriptionChange}
          value={description}
          type='text'
          multiline={3}
          placeholder='Enter a short description of the business'
          labelHidden
        />
        <FormLayout.Group>
          <Select
            label='Category'
            options={categoryOptions}
            onChange={handleCategorySelectChange}
            value={category}
            placeholder='Choose a category'
            labelHidden
          />
          <Select
            label='Tags'
            options={typeOptions}
            onChange={handleTypeChange}
            value={type}
            labelHidden
            placeholder='Choose type'
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
        <TextField
          label='URL'
          onChange={handleURLChange}
          value={url}
          type='text'
          placeholder='URL'
          labelHidden
        />
        <Button submit>Submit</Button>
      </FormLayout>
    </Form>
  );
};
export default StoreForm;

/*

  name: String! @unique
  description:
  category:
  tags:
  url:
  primaryMethod:
  methodOnline:
  methodForm:
  methodEmail:
  methodPhone:


  email:
  delivery:
  phone:
  pickup:
  invertedImage:
  image:

}
*/
