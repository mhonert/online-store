import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import User, { CURRENT_USER_QUERY } from './User';
import calcTotalPrice from '../lib/calcTotalPrice';
import { countItems } from './CartCount';

import getConfig from 'next/config';
import Mutation from 'react-apollo/Mutation';

const { publicRuntimeConfig } = getConfig();
const { stripePublishableKey } = publicRuntimeConfig;

export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

export const onToken = async (res, createOrder) => {
  NProgress.start();
  const order = await createOrder({
    variables: {
      token: res.id
    }
  }).catch(err => {
    alert(err.message);
  });

  Router.push({
    pathname: '/order',
    query: { id: order.data.createOrder.id }
  });
};

const Payment = ({ children }) => {

  return (
    <User>
      {({ data: { me }, loading }) => {
        if (loading) {
          return 'Loading ...';
        }

        if (!me || !me.cart || me.cart.length === 0) {
          return null;
        }

        return (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Fresh Fruits"
                description={`Order of ${countItems(me.cart)} items`}
                image={me.cart[0].item.image}
                currency="USD"
                email={me.email}
                stripeKey={stripePublishableKey}
                token={res => onToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        );
      }}
    </User>
  );
};

export default Payment;
