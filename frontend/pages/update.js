import React from "react"
import UpdateItem from "../components/UpdateItem";

const Update = ({query}) => (
  <div>
    {query && <UpdateItem id={query.id}/>}
  </div>
)

export default Update;
