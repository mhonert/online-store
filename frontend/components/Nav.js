import React from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => {
  return (
    <NavStyles>
      <Link href="/items">
        <a href="items">Items</a>
      </Link>
      <Link href="/sell">
        <a href="sell">Sell</a>
      </Link>
      <Link href="/signup">
        <a href="signup">Sign up</a>
      </Link>
      <Link href="/orders">
        <a href="orders">Orders</a>
      </Link>
      <Link href="/me">
        <a href="me">Account</a>
      </Link>
    </NavStyles>
  );
};

export default Nav;