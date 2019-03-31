import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeCartItem, fakeUser } from '../../lib/testUtils';
import AddToCart, { ADD_TO_CART_MUTATION } from '../../components/AddToCart';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  },
  {
    request: {
      query: ADD_TO_CART_MUTATION,
      variables: {
        id: 'abc123'
      }
    },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1
        }
      }
    }
  }
];

describe('<AddToCart/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });

  it('changes button from enabled to disabled after click', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123"/>
      </MockedProvider>);

    await wait();
    wrapper.update();

    expect(wrapper.text()).toContain('Add to Cart');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('button').prop("disabled")).toBe(true);
  })

});
