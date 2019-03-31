import React from "react"
import CreateItem from "../components/CreateItem";
import SignInRequired from '../components/SignInRequired';

const Sell = () => (
    <div>
      <SignInRequired>
        <CreateItem />
      </SignInRequired>
    </div>
)

export default Sell;
