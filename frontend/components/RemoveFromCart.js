import React from 'react';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';
import Mutation from 'react-apollo/Mutation';
import gql from 'graphql-tag';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation($id: ID!) {
    removeFromCart(id: $id) {
      quantity
    }
  }
`;

const RemoveFromCart = ({ cartItem }) => {
  const { quantity } = cartItem;
  const { id: itemId } = cartItem.item;

  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id: itemId }}
      optimisticResponse={{
        __typename: 'Mutation',
        removeFromCart: {
          __typename: 'CartItem',
          quantity: quantity - 1,
        }
      }}
      update={(cache, payload) => {
        const data = cache.readQuery({ query: CURRENT_USER_QUERY });

        const { quantity } = payload.data.removeFromCart;
        if (quantity === 0) {
          // remove item
          data.me.cart = data.me.cart.filter(
            cartItem => cartItem.item.id !== itemId
          );
        } else {
          // update item quantity
          const item = data.me.cart.find(
            cartItem => cartItem.item.id === itemId
          );
          if (item) {
            item.quantity = quantity;
          }
        }

        // Write data back to the cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data: data });
      }}
    >
      {(removeFromCart, { loading }) => (
        <BigButton
          disabled={loading}
          onClick={() => {
            removeFromCart().catch(err => alert(err.message));
          }}
          title="Delete Item"
        >
          &times;
        </BigButton>
      )}
    </Mutation>
  );
};

export default RemoveFromCart;
