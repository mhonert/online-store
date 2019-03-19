import React, { useState } from 'react';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import Router from 'next/router';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
        message
    }
  }
`;

const RequestReset = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e, requestReset) => {
    e.preventDefault();

    const response = await requestReset();
    setEmail('');
  };

  return (
    <Mutation
      mutation={REQUEST_RESET_MUTATION}
      variables={{ email }}
    >
      {(requestReset, { error, loading, called }) => {
        return (
          <Form method="post" onSubmit={e => handleSubmit(e, requestReset)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Forgot password?</h2>
              <DisplayError error={error} />
              {!error && !loading && called && <p>Success! Check your email for a reset link.</p>}
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
            </fieldset>

            <button type="submit">Reset Password!</button>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default RequestReset;
