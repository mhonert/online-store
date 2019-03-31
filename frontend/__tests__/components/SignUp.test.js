import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { fakeUser } from '../../lib/testUtils';
import { CURRENT_USER_QUERY } from '../../components/User';
import SignUp, { SIGNUP_MUTATION } from '../../components/SignUp';
import Router from 'next/router';

const me = fakeUser();

// mock the router
Router.router = { push: jest.fn() };

const mocks = [
  // signup mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: 'xyz'
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name
        }
      }
    }
  },

  // current user query mock
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: { me }
    }
  }
];

describe('<SignUp/>', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('user is routed to home page after sign up', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    simulateInput(wrapper, 'name', me.name);
    simulateInput(wrapper, 'email', me.email);
    simulateInput(wrapper, 'password', 'xyz', 'password');

    wrapper.update();
    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();

    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/' });
  });
});

const simulateInput = (wrapper, name, value, type) => {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate('change', { target: { name, value, type } });
};
