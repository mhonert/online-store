import React from "react"
import SignInRequired from '../components/SigninRequired';
import OrderList from '../components/OrderList';

const OrdersPage = () => (
  <div>
    <SignInRequired>
      <OrderList />
    </SignInRequired>
  </div>
)

export default OrdersPage;
