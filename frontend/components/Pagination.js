import React from 'react';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import DisplayError from './ErrorMessage';
import Head from 'next/head';
import Link from 'next/link';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (error) return <DisplayError error={error} />;
        if (loading) return <p>Loading ...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);

        return (
          <PaginationStyles>
            <Head>
              <title>
                Fresh Fruits | Page {page} of {pages}
              </title>
            </Head>
            <Link
              prefetch
              href={{
                pathname: '',
                query: { page: page - 1 }
              }}
            >
              <a className="prev" aria-disabled={page <= 1}>⬅ Prev</a>
            </Link>

            <p>
              Page {page} of {pages}
            </p>

            <Link
              prefetch
              href={{
                pathname: '',
                query: { page: page + 1 }
              }}
            >
              <a className="next" aria-disabled={page >= pages}>Next ➡</a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
