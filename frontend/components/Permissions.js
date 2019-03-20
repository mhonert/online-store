import React, { useState } from 'react';
import Query from 'react-apollo/Query';
import DisplayError from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import Button from './styles/Button';
import PropTypes from 'prop-types';
import Mutation from 'react-apollo/Mutation';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      email
      name
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $userId: ID!
    $permissions: [Permission]!
  ) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      id
    }
  }
`;

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const Permissions = () => {
  return (
    <Query query={ALL_USERS_QUERY}>
      {({ data, loading, error }) => (
        <>
          <h2>Manage Permissions</h2>
          <DisplayError error={error} />
          {data && data.users && (
            <div>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {possiblePermissions.map(permission => (
                      <th key={permission}>{permission}</th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <UserPermissions user={user} key={user.id} />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </Query>
  );
};

const UserPermissions = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permissions);

  const updatePermission = (permission, enabled) => {
    if (enabled) {
      setPermissions([...permissions, permission]);
    } else {
      setPermissions(
        permissions.filter(
          existingPermission => existingPermission !== permission
        )
      );
    }
  };

  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      {possiblePermissions.map(permission => (
        <td key={permission}>
          <label>
            <input
              id={`${user.id}-permission-${permission}`}
              type="checkbox"
              checked={permissions.includes(permission)}
              onChange={e => updatePermission(permission, e.target.checked)}
            />
          </label>
        </td>
      ))}
      <td>
        <Mutation
          mutation={UPDATE_PERMISSIONS_MUTATION}
          variables={{ userId: user.id, permissions }}
        >
          {(updatePermissions, { loading, error }) => (
            <>
              <DisplayError error={error} />
              <Button
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? 'ing' : 'e'}
              </Button>
            </>
          )}
        </Mutation>
      </td>
    </tr>
  );
};

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    permissions: PropTypes.array
  }).isRequired
};

export default Permissions;
