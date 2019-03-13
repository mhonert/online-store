import React, {useState} from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import Router from 'next/router';

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
    $title: String!,
    $description: String!,
    $price: Int!,
    $image: String,
    $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`

const CreateItem = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e, createItem) => {
    // Stop the for from submitting
    e.preventDefault();

    // call the mutation
    const result = await createItem();

    // change them to the single item page
    Router.push({
      pathname: '/item',
      query: {id: result.data.createItem.id}
    });
  }

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={{title, description, image, largeImage, price}}>
      {(createItem, { loading, error }) => (
        <Form onSubmit={e => handleSubmit(e, createItem)}>
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label>Title
              <input type="text" name="title"
                     placeholder="Title" required
                     value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <label>Price
              <input type="number" name="price"
                     placeholder="Price" required
                     value={price} onChange={e => setPrice(e.target.value)} />
            </label>
            <label>Description
              <textarea type="text" name="description"
                        placeholder="Enter a Description" required
                        value={description} onChange={e => setDescription(e.target.value)} />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default CreateItem;
