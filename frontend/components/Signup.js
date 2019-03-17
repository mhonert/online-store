import React from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import { useState } from 'react';
import DisplayError from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e, signup) => {
    e.preventDefault();

    const response = await signup();
    setEmail('');
    setName('');
    setPassword('');

    // change them to the account page
    Router.push({
      pathname: '/account'
    });
  };

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={{ name, email, password }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => {
        return (
          <Form method="post" onSubmit={e => handleSubmit(e, signup)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Register An Account</h2>
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
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  required
                  onChange={e => setName(e.target.value)}
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

            <button type="submit">Register!</button>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Signup;
