import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e, signin) => {
    e.preventDefault();

    const response = await signin();
    setEmail('');
    setPassword('');

    // change them to the account page
    Router.push({
      pathname: '/account'
    });
  };

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={{ email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signin, { error, loading }) => {
        return (
          <Form method="post" onSubmit={e => handleSubmit(e, signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Into your Account</h2>
              <DisplayError error={error} />
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  required
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
            </fieldset>

            <button type="submit">Sign In!</button>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default SignIn;
