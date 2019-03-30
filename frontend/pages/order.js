import React from "react"
import SignInRequired from '../components/SigninRequired';
import Order from '../components/Order';

const OrderPage = ({query}) => (
  <div>
    <SignInRequired>
      <Order id={query.id} />
    </SignInRequired>
  </div>
)

export default OrderPage;
