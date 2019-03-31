import React from "react"
import SignInRequired from '../components/SignInRequired';
import OrderList from '../components/OrderList';

const OrdersPage = () => (
  <div>
    <SignInRequired>
      <OrderList />
    </SignInRequired>
  </div>
)

export default OrdersPage;
