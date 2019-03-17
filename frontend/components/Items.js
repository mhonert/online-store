import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int, $first: Int) {
        items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

const Items = ({page}) => {
  const removeItemFromCache = (cache, payload) => {
    // Manually update the cache on the client
    const data = cache.readQuery({query: ALL_ITEMS_QUERY});
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id)
    cache.writeQuery({query: ALL_ITEMS_QUERY, data});
  }

  const itemStart = (page - 1) * perPage;

  return (
    <Center>
      <Pagination page={page}/>
      <Query query={ALL_ITEMS_QUERY} variables={{skip: itemStart, first: perPage}}>
        {({data, error, loading}) => {
          if (loading) {
            return <p>Loading ....</p>
          }
          if (error) {
            return <p>Error: {error.message}</p>
          }
          return <ItemsList>
            {data.items.map(item => <Item item={item} key={item.id} onDelete={removeItemFromCache}/>)}
          </ItemsList>
        }}
      </Query>
      <Pagination page={page}/>
    </Center>
  );
};

export default Items;