import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Query from 'react-apollo/Query';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import { parseISO, format } from 'date-fns';

export const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const Order = ({ id }) => {
  return (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
      {({ data, error, loading }) => {
        if (error) {
          return <Error error={error} />;
        }
        if (loading) return <p>Loading ...</p>;

        const order = data.order;

        return (
          <OrderStyles>
            <Head>
              <title>Fresh Fruits | {order.id}</title>
            </Head>
            <p>
              <span>Order ID</span>
              <span>{id}</span>
            </p>
            <p>
              <span>Charge</span>
              <span>{order.charge}</span>
            </p>
            <p>
              <span>Date</span>
              <span>{format(parseISO(order.createdAt), 'dd.MM.yyyy HH:mm:ss')}</span>
            </p>
            <p>
              <span>Order Total</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <div className="items">
              {order.items.map(item => (
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Each: {formatMoney(item.price)}</p>
                    <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        );
      }}
    </Query>
  );
};

Order.propTypes = {
  id: PropTypes.string.isRequired
};

export default Order;
