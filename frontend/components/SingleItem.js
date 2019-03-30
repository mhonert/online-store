import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import DisplayError from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItem = ({ id }) => {
  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id: id }}>
      {({ error, data, loading }) => {
        if (error) return <DisplayError error={error} />;
        if (loading) return <p>Loading ...</p>;
        const item = data.item;
        if (!item) return <p>No item found for ID {id}</p>;

        return (
          <SingleItemStyles>
            <Head>
              <title>Fresh Fruits | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title} />
            <div className="details">
              <h2>Viewing {item.title}</h2>
              <p>{item.description}</p>
            </div>
          </SingleItemStyles>
        );
      }}
    </Query>
  );
};

export default SingleItem;
