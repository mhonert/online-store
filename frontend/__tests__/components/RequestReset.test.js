import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import RequestReset, {
  REQUEST_RESET_MUTATION
} from '../../components/RequestReset';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'test@localhost' }
    },
    result: {
      data: {
        requestReset: { message: 'success', __typename: 'Message' }
      }
    }
  }
];

describe('<RequestReset />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    // simulate entered email address
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'test@localhost' }
    });

    await wait();
    wrapper.update();

    wrapper.find('form').simulate('submit');
    await wait();
    wrapper.update();

    expect(wrapper.find('p').text()).toContain(
      'Success! Check your email for a reset link'
    );
  });
});
