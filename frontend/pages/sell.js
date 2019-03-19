import React from "react"
import CreateItem from "../components/CreateItem";
import SigninRequired from '../components/SigninRequired';

const Sell = () => (
    <div>
      <SigninRequired>
        <CreateItem />
      </SigninRequired>
    </div>
)

export default Sell;
