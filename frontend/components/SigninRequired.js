import React from 'react';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';
import Query from 'react-apollo/Query';

const SigninRequired = ({ children }) => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({data, loading}) => {
        if (loading) return <p>Loading ...</p>;
        console.log(data);
        if (!data.me) {
          return (
            <>
              <p>You need to sign in to access this page.</p>
              <Signin />
            </>
          );
        }
        return children;
      }}
    </Query>
  );
};

export default SigninRequired;
