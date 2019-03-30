import React from "react"
import CreateItem from "../components/CreateItem";
import SignInRequired from '../components/SigninRequired';

const Sell = () => (
    <div>
      <SignInRequired>
        <CreateItem />
      </SignInRequired>
    </div>
)

export default Sell;
