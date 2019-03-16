import React, {useState} from 'react';
import gql from 'graphql-tag';
import {Mutation, Query} from 'react-apollo';
import Form from './styles/Form';
import Error from './ErrorMessage';
import Router from 'next/router';

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
      $id: ID!,
      $title: String,
      $description: String,
      $price: Int,
    ) {
        updateItem(
            id: $id,
            title: $title
            description: $description
            price: $price
        ) {
            id
        }
    }
`

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
      item(where: {id: $id }) {
        title
        description
        price
    }
  }
`

const UpdateItem = ({id}) => {
  const [title, setTitle] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [price, setPrice] = useState(undefined);

  const saveChanges = async (e, updateItemMutation) => {
    console.log("Updating item ...");

    // Stop the form from submitting
    e.preventDefault();

    // call the mutation
    const result = await updateItemMutation({
      variables: {
        id,
        title,
        description,
        price
      }
    });

    // change them to the single item page
    Router.push({
      pathname: '/item',
      query: {id: result.data.updateItem.id}
    });
  }

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{id}}>
      {({data, loading}) => {
        if (loading) return <p>Loading ...</p>
        if (!data.item) return <p>No item found for ID {id}</p>
        return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={{id, title, description, price}}>
            {(updateItem, { loading, error }) => (
              <Form onSubmit={e => saveChanges(e, updateItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label>Title
                    <input type="text" name="title"
                           placeholder="Title" required
                           defaultValue={data.item.title} onChange={e => setTitle(e.target.value)} />
                  </label>
                  <label>Price
                    <input type="number" name="price"
                           placeholder="Price" required
                           defaultValue={data.item.price}
                           onChange={e => setPrice(e.target.value)} />
                  </label>
                  <label>Description
                    <textarea type="text" name="description"
                              placeholder="Enter a Description" required
                              defaultValue={data.item.description} onChange={e => setDescription(e.target.value)} />
                  </label>
                  <button type="submit">Save Changes</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        )}}
    </Query>
  );
};

export default UpdateItem;
