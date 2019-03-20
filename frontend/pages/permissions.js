import React from "react"
import SigninRequired from '../components/SigninRequired';
import Permissions from '../components/Permissions';

const PermissionsPage = () => (
  <div>
    <SigninRequired>
      <Permissions />
    </SigninRequired>
  </div>
)

export default PermissionsPage;
