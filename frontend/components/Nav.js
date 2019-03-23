import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import Mutation from 'react-apollo/Mutation';
import CartCount from './CartCount';

const Nav = () => {
  return (
    <User>
      {({ data: { me } }) => (
        <NavStyles>
          <Link href="/">
            <a href="index">Shop</a>
          </Link>
          {me && (
            <>
              <Link href="/sell">
                <a href="sell">Sell</a>
              </Link>
              <Link href="/orders">
                <a href="orders">Orders</a>
              </Link>
              <Link href="/account">
                <a href="account">Account</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => <button onClick={toggleCart}>My Cart
                  <CartCount cart={me.cart} />
                </button>}
              </Mutation>
            </>
          )}
          {!me && (
            <Link href="/signin">
              <a href="signin">Sign In</a>
            </Link>
          )}
        </NavStyles>
      )}
    </User>
  );
};

export default Nav;
