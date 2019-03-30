import { mount } from 'enzyme';
import wait from 'waait';
import SignInRequired from '../../components/SignInRequired'

import { MockedProvider } from 'react-apollo/test-utils';
import { CURRENT_USER_QUERY } from '../../components/User';
import { fakeUser } from '../../lib/testUtils';
import React from 'react';

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

const TestComponent = () => <p>Test!</p>;

describe("<SignInRequired/>", () => {
  it("renders the sign in dialog to signed out users", async () => {
    const wrapper = mount(<MockedProvider mocks={notSignedInMocks}>
        <SignInRequired/>
      </MockedProvider>);

    await wait();
    wrapper.update();

    expect(wrapper.find('SignIn').exists()).toBe(true);
  });

  it("does not render the child component for signed out users", async () => {
    const wrapper = mount(<MockedProvider mocks={notSignedInMocks}>
      <SignInRequired>
        <TestComponent/>
      </SignInRequired>
    </MockedProvider>);

    await wait();
    wrapper.update();

    expect(wrapper.find('TestComponent').exists()).toBe(false);
  });

  it("does not render the sign in dialog to already signed in users", async () => {
    const wrapper = mount(<MockedProvider mocks={signedInMocks}>
      <SignInRequired>
        <TestComponent/>
      </SignInRequired>
    </MockedProvider>);

    await wait();
    wrapper.update();

    expect(wrapper.find('SignIn').exists()).toBe(false);
  });

  it("renders the child component when the user is signed in", async() => {
    const wrapper = mount(<MockedProvider mocks={signedInMocks}>
      <SignInRequired>
        <TestComponent/>
      </SignInRequired>
    </MockedProvider>);

    await wait();
    wrapper.update();

    expect(wrapper.find('TestComponent').exists()).toBe(true);
  });

});