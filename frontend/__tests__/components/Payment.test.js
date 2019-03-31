import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import Router from 'next/router';
import React from 'react';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeCartItem, fakeUser } from '../../lib/testUtils';
import Payment, { onToken } from '../../components/Payment';
import NProgress from 'nprogress';

// mock runtime configuration which is usually loaded by next.js from the config.js file,
// but is unavailable during testing
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { stripePublishableKey: 'test' }
}));

Router.router = { push: jest.fn() };

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
  }
];

describe('<Payment/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Payment />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot();
  });

  it('routes to the single order page after payment', async () => {
    onToken({ id: 'abc123' }, async () => ({
      data: {
        createOrder: {
          id: 'abc123'
        }
      }
    }));
    await wait();

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/order",
      query: { id: "abc123"}
    });
  });

  it('turns the progress bar on', async () => {
    NProgress.start = jest.fn();

    onToken({ id: 'abc123' }, async () => ({
      data: {
        createOrder: {
          id: 'abc123'
        }
      }
    }));
    await wait();

    expect(NProgress.start).toHaveBeenCalled();
  })
});
