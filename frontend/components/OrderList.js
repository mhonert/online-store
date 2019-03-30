import React from 'react';
import gql from 'graphql-tag';
import ErrorMessage from './ErrorMessage';
import Query from 'react-apollo/Query';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';
import { parseISO, formatDistance } from 'date-fns';
import styled from 'styled-components';
import OrderItemStyles from './styles/OrderItemStyles';

const ORDERS_QUERY = gql`
  query ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => {
  return (
    <Query query={ORDERS_QUERY}>
      {({ data, loading, error }) => {
        if (loading) {
          return <p>Loading ...</p>;
        }
        if (error) {
          return <ErrorMessage error={error} />;
        }

        const { orders } = data;

        return (
          <div>
            <h2>
              You have {orders.length} order{orders.length === 1 ? '' : 's'}
            </h2>
            <OrderUl>
              {orders.map(order => (
                <OrderItemStyles key={order.id}>
                  <Link href={{ pathname: '/order', query: { id: order.id } }}>
                    <a>
                      <div className="order-meta">
                        <p>
                          {order.items.reduce(
                            (count, item) => count + item.quantity,
                            0
                          )}{' '}
                          Items
                        </p>
                        <p>
                          {formatDistance(
                            parseISO(order.createdAt),
                            new Date()
                          )}{' '}
                          ago
                        </p>
                        <p>{formatMoney(order.total)}</p>
                      </div>
                      <div className="images">
                        {order.items.map(item => (
                          <img
                            key={item.id}
                            src={item.image}
                            alt={item.title}
                          />
                        ))}
                      </div>
                    </a>
                  </Link>
                  {/*<td>{order.id}</td>*/}
                  {/*<td>{order.charge}</td>*/}
                  {/*<td>{formatMoney(order.total)}</td>*/}
                  {/*<td>*/}
                  {/*</td>*/}
                </OrderItemStyles>
              ))}
            </OrderUl>
          </div>
        );
      }}
    </Query>
  );
};

export default OrderList;
