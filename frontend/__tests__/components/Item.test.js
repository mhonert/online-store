import Item from '../../components/Item';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
  id: '4923423AKDJA',
  title: 'An Item',
  price: 500,
  description: 'This is a test item',
  image: 'item.jpg',
  largeImage: 'largeImage.jpg',
};

describe('<Item/>', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders the pricetag and title', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const PriceTag = wrapper.find('PriceTag');

    expect(PriceTag.children().text()).toBe('$5');
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders the buttons', () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const buttonList = wrapper.find('.buttonList');

    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link').exists()).toBe(true);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});