import React from 'react';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import gql from 'graphql-tag';
import ApolloConsumer from 'react-apollo/ApolloConsumer';
import { useState } from 'react';
import debounce from 'lodash.debounce';
import Downshift from 'downshift';
import Router from 'next/router';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

const Search = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changingSearchTerm, setChangingSearchTerm] = useState(false);

  const onSearchTermChange = debounce(async (searchTerm, client) => {
    setChangingSearchTerm(false);
    if (!searchTerm) {
      setItems([]);
      return;
    }
    setLoading(true);
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm }
    });

    setItems(res.data.items);
    setLoading(false);
  }, 350);

  const routeToItem = item => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      }
    });
  };

  return (
    <SearchStyles>
      <Downshift
        itemToString={item => (item === null ? '' : item.title)}
        onChange={routeToItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex
        }) => (
          <div>
            {/*// Search input*/}
            <ApolloConsumer>
              {client => (
                <input
                  {...getInputProps({
                    type: 'search',
                    placeholder: 'Search for an item',
                    id: 'search',
                    className: loading ? 'loading' : '',
                    onChange: e => {
                      setChangingSearchTerm(true);
                      e.persist();
                      onSearchTermChange(e.target.value, client);
                    }
                  })}
                />
              )}
            </ApolloConsumer>

            {/*// Search results*/}
            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.description} />
                    {item.title}
                  </DropDownItem>
                ))}
                {items.length === 0 && !loading && !changingSearchTerm && inputValue && (
                  <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

export default Search;
