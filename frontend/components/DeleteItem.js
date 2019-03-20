import React from 'react';
import gql from 'graphql-tag';
import {Mutation, Query} from 'react-apollo';

export const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(id: $id) {
            id
        }
    }
`

const DeleteItem = ({id, onDelete, children}) => {
  const handleDelete = async (e, deleteItemMutation) => {
    if (!confirm("Would you really like to delete this item?")) {
      return;
    }

    const result = await deleteItemMutation().catch(e => alert(e));
  }

  return (
    <Mutation mutation={DELETE_ITEM_MUTATION} variables={{id}} update={onDelete}>
      {(deleteItem, { loading, error }) => (
        <button onClick={e => handleDelete(e, deleteItem)}>{children}</button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
