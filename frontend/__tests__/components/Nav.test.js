import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeUser } from '../../lib/testUtils';
import React from 'react';
import Nav from '../../components/Nav';

// mock runtime configuration which is usually loaded by next.js from the config.js file,
// but is unavailable during testing
jest.mock('next/config', () => () => ({ publicRuntimeConfig: { stripePublishableKey: 'test'} }));

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

describe('<Nav/>', () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('NavStyles'))).toMatchSnapshot();
  });

  it("renders the full nav when signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(wrapper.find('NavStyles > ul').children()).toHaveLength(5);
  });
});
