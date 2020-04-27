import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Layout,
  Card,
  TextStyle,
  Banner,
  Heading,
  ResourceList,
  ResourceItem,
  Link,
  SkeletonThumbnail,
  Badge,
  Icon,
} from '@shopify/polaris';
import {
  ShipmentMajorMonotone,
  GlobeMajorMonotone,
  FormsMajorMonotone,
  EmailMajorMonotone,
  PhoneMajorMonotone,
  StoreMajorMonotone,
  EditMajorMonotone,
} from '@shopify/polaris-icons';

const StoreFooter = ({ store }) => {
  const { url, primaryMethod, pickup, delivery, phone, id } = store;
  const icons = {
    phone: PhoneMajorMonotone,
    email: EmailMajorMonotone,
    online: GlobeMajorMonotone,
    form: FormsMajorMonotone,
  };

  const methodText = {
    phone: 'Phone orders',
    email: 'Email orders',
    online: 'Online store orders',
    form: 'Online form orders',
  };

  return (
    <>
      <Banner icon={icons[primaryMethod]} status="info">
        {methodText[primaryMethod]}
      </Banner>
      <Card.Section>
        <span className="icon-wrapper">
          <Icon source={ShipmentMajorMonotone} /> Home delivery{' '}
          <Badge status={delivery ? 'success' : 'warning'}>
            {delivery ? 'Yes' : 'No'}
          </Badge>
        </span>
        <span className="icon-wrapper">
          <Icon source={StoreMajorMonotone} /> Store pickup{' '}
          <Badge status={pickup ? 'success' : 'warning'}>
            {pickup ? 'Yes' : 'No'}
          </Badge>
        </span>
      </Card.Section>
      <Card.Section>
        <span className="store-card--footer">
          <span>
            <Link external monochrome url={url}>
              Visit site
            </Link>{' '}
            {primaryMethod === 'phone' && (
              <span>
                or{' '}
                <Link external monochrome url={`tel:${phone}`}>
                  Call
                </Link>
              </span>
            )}
          </span>
          <RouterLink
            to={{
              pathname: '/updatestore/',
              search: `?id=${id}`,
              state: { storeId: `${id}`, store },
            }}
          >
            <Icon source={EditMajorMonotone} />
          </RouterLink>
        </span>
      </Card.Section>
    </>
  );
};

const Store = (props) => {
  const { store } = props;
  const bg = store.invertedImage ? 'black' : 'none';
  const imageStyle = {
    objectFit: 'contain',
    objectPosition: 'center',
    maxWidth: '75px',
    height: '75px',
    backgroundColor: bg,
  };
  return (
    <Layout.Section oneThird>
      <Card>
        <span className="store-wrapper">
          <ResourceList
            resourceName={{ singular: 'store', plural: 'stores' }}
            items={[
              {
                id: 145,
                url: store.url,
                avatarSource: store.image,
                type: store.type,
                category: store.category,
                name: store.name,
              },
            ]}
            renderItem={(item) => {
              const { id, avatarSource, name, type, category } = item;

              return (
                <ResourceItem
                  id={id}
                  media={
                    store.image && (
                      <img
                        alt={`${store.name} logo`}
                        style={imageStyle}
                        src={avatarSource}
                      />
                    )
                  }
                  accessibilityLabel={`View details for ${name}`}
                  name={name}
                >
                  <Heading>
                    <TextStyle variation="strong">{name}</TextStyle>
                  </Heading>
                  <span className="store-info">
                    <TextStyle variation="strong">{category}</TextStyle>
                    <br />
                    {type}
                  </span>
                </ResourceItem>
              );
            }}
          />
          <span className="store-description--wrapper">
            <Card.Section>{store.description}</Card.Section>
          </span>
          <StoreFooter store={store} />
        </span>
      </Card>
    </Layout.Section>
  );
};

export default Store;
