import React from 'react';
import { DisplayText, Icon } from '@shopify/polaris';
import { NavLink } from 'react-router-dom';
import { StoreMajorMonotone } from '@shopify/polaris-icons';
const Nav = (props) => {
  const { uniqueCategories } = props;
  const activeNavStyle = {
    backgroundClip: 'border-box',
    position: 'relative',
    borderBottom: '3px solid #202e78',
    color: '#202e78',
  };
  return (
    <nav className='nav'>
      <DisplayText size='large'>Ottawa Stores</DisplayText>

      <ul className='nav-links'>
        <li>
          <NavLink to='/' exact activeStyle={activeNavStyle}>
            All
          </NavLink>
        </li>
        {uniqueCategories.map((cat, index) => {
          return (
            <li key={index}>
              <NavLink to={`/${cat}`} activeStyle={activeNavStyle}>
                {cat}
              </NavLink>
            </li>
          );
        })}
        <NavLink to='/addstore' activeStyle={activeNavStyle}>
          <Icon source={StoreMajorMonotone} />
        </NavLink>
      </ul>
    </nav>
  );
};

export default Nav;
