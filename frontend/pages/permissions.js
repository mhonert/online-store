import React from "react"
import SignInRequired from '../components/SigninRequired';
import Permissions from '../components/Permissions';

const PermissionsPage = () => (
  <div>
    <SignInRequired>
      <Permissions />
    </SignInRequired>
  </div>
)

export default PermissionsPage;
