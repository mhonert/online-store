import React from 'react';
import gql from 'graphql-tag';
import Mutation from 'react-apollo/Mutation';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const SignOut = () => {
  const handleSignOut = async (signout) => {
    const success = await signout();

    // change them to the sign in page
    Router.push({
      pathname: '/signin'
    });
  }
  return (
    <Mutation
      mutation={SIGN_OUT_MUTATION}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {signout => <button onClick={() => handleSignOut(signout)}>Sign Out</button>}
    </Mutation>
  );
};

export default SignOut;
