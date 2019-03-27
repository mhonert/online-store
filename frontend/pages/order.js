import React from "react"
import SigninRequired from '../components/SigninRequired';
import Order from '../components/Order';

const OrderPage = ({query}) => (
  <div>
    <SigninRequired>
      <Order id={query.id} />
    </SigninRequired>
  </div>
)

export default OrderPage;
