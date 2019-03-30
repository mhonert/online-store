import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import SingleItem, { SINGLE_ITEM_QUERY } from '../../components/SingleItem';
import { MockedProvider } from 'react-apollo/test-utils';

import { fakeItem } from '../../lib/testUtils';

describe('<SingleItem/>', () => {
  it('renders correctly', async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        result: {
          data: {
            item: fakeItem()
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain('Loading ...');
    await wait();
    wrapper.update();

    expect(toJSON(wrapper.find('SingleItem__SingleItemStyles'))).toMatchSnapshot();
  });

  it('errors with not found item', async() => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        result: {
          errors: [{message: 'Items Not Found!'}]
        }
      }
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('[data-test="graphql-error"]'))).toMatchSnapshot();
  })
});
