import React from "react"
import SigninRequired from '../components/SigninRequired';
import OrderList from '../components/OrderList';

const OrdersPage = () => (
  <div>
    <SigninRequired>
      <OrderList />
    </SigninRequired>
  </div>
)

export default OrdersPage;
