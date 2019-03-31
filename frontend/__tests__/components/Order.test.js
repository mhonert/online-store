import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { fakeOrder } from '../../lib/testUtils';
import Order, { SINGLE_ORDER_QUERY } from '../../components/Order';

const testOrder = fakeOrder();

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: testOrder.id } },
    result: { data: { order: testOrder } }
  }
];

describe('<Order/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id={testOrder.id} />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('OrderStyles'))).toMatchSnapshot();
  });
});
