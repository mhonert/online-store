import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const ResetPassword = ({ resetToken }) => {
  if (!resetToken) {
    return <p>No reset token given.</p>;
  }
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e, resetPassword) => {
    e.preventDefault();

    const response = await resetPassword();

    // change them to the home page
    Router.push({
      pathname: '/'
    });
  };

  return (
    <Mutation
      mutation={RESET_PASSWORD_MUTATION}
      variables={{ resetToken, password, confirmPassword }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(resetPassword, { error, loading }) => {
        return (
          <Form method="post" onSubmit={e => handleSubmit(e, resetPassword)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <DisplayError error={error} />
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
              <label>
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  required
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </label>
            </fieldset>

            <button type="submit">Save Password</button>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default ResetPassword;
