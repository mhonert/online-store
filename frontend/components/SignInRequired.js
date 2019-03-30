import React from 'react';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';
import Query from 'react-apollo/Query';

const SignInRequired = ({ children }) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({data, loading}) => {
        if (loading) return <p>Loading ...</p>;
        if (!data.me) {
          return (
            <>
              <p>You need to sign in to access this page.</p>
              <SignIn />
            </>
          );
        }
        return children;
      }}
    </Query>
  );
};

export default SignInRequired;
