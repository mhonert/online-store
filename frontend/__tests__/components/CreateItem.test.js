import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';

import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../../components/CreateItem';
import { fakeItem } from '../../lib/testUtils';

// mock runtime configuration which is usually loaded by next.js from the config.js file,
// but is unavailable during testing
jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { stripePublishableKey: 'test' }
}));

const testImage = 'https://localhost/test.jpg';

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: testImage,
    eager: [{ secure_url: testImage }]
  })
});

Router.router = {
  push() {},
  prefetch() {}
};

describe('<CreateItem/>', () => {
  it('Renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('Uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['test.jpg'] } });
    await wait();
    wrapper.update();

    expect(wrapper.find('img').prop('src')).toBe(testImage);
    expect(global.fetch).toBeCalled();
  });

  it('Creates and item when the form is submitted', async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: '',
            largeImage: '',
            price: item.price
          }
        },
        result: {
          data: {
            createItem: {
              ...item,
              __typename: 'Item'
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem/>
      </MockedProvider>
    );

    // simulate form input
    simulateInput(wrapper, 'title', item.title);
    simulateInput(wrapper, 'price', item.price, 'number');
    simulateInput(wrapper, 'description', item.description);

    // mock the router
    Router.router = { push: jest.fn() };
    wrapper.find('form').simulate('submit');

    await wait(50);
    wrapper.update();

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item",
      query: {
        id: item.id
      }
    });
  });
});

const simulateInput = (wrapper, name, value, type) => {
  wrapper
    .find(`#${name}`)
    .simulate('change', { target: { name, value, type } });
};
