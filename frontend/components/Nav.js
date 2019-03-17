import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

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
