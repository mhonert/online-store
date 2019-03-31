import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeCartItem, fakeUser } from '../../lib/testUtils';
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION
} from '../../components/RemoveFromCart';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: 'abc123' })]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        id: 'abc123'
      }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: 'abc123'
        }
      }
    }
  }
];

describe('<RemoveFromCart/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart cartItem={fakeCartItem()} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot();
  });
});
