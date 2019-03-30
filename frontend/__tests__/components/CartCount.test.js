import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../../components/CartCount';

const testCart = [{quantity: 1}, {quantity: 2}];

describe('<CartCount/>', () => {
  it('renders', () => {
    shallow(<CartCount cart={testCart} />);
  });

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCount cart={testCart} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});