import React from "react"
import ResetPassword from '../components/ResetPassword';

const ResetPage = ({query}) => (
  <div>
    <ResetPassword resetToken={query.resetToken} />
  </div>
)

export default ResetPage;
