import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import { PAGINATION_QUERY } from '../../components/Pagination';
import Pagination from '../../components/Pagination';

import Router from 'next/router';

const createMocksFor = length => [
  {
    request: {
      query: PAGINATION_QUERY
    },
    result: {
      data: {
        itemsConnection: {
          __typename: 'aggregate',
          aggregate: {
            __typename: 'count',
            count: length
          }
        }
      }
    }
  }
];

Router.router = {
  push() {},
  prefetch() {}
};

describe('<Pagination/>', () => {
  it('displays a loading message', () => {
    const wrapper = mount(
      <MockedProvider mocks={createMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(wrapper.find('p').text()).toBe("Loading ...");
  });

  it('renders pagination for 20 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={createMocksFor(20)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('PaginationStyles'))).toMatchSnapshot()
  });

  it('disables prev button and enables next button on first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={createMocksFor(20)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(wrapper.find(".prev").prop('aria-disabled')).toBe(true);
    expect(wrapper.find(".next").prop('aria-disabled')).toBe(false);
  });

  it('disables next button and enables prev button on last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={createMocksFor(20)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(wrapper.find(".prev").prop('aria-disabled')).toBe(false);
    expect(wrapper.find(".next").prop('aria-disabled')).toBe(true);
  });

  it('enables all buttons on a middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={createMocksFor(20)}>
        <Pagination page={2} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();

    expect(wrapper.find(".prev").prop('aria-disabled')).toBe(false);
    expect(wrapper.find(".next").prop('aria-disabled')).toBe(false);
  });


});
