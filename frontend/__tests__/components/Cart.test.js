import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeCartItem, fakeUser } from '../../lib/testUtils';
import { LOCAL_STATE_QUERY } from '../../components/Cart';
import Cart from '../../components/Cart';

// mock runtime configuration which is usually loaded by next.js from the config.js file,
// but is unavailable during testing
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { stripePublishableKey: 'test' }
}));

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
    request: { query: LOCAL_STATE_QUERY },
    result: {
      data: {}
    }
  }
];

describe('<Cart/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Cart />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('header'))).toMatchSnapshot();
  });
});
