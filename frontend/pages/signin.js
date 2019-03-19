import React from 'react';
import styled from 'styled-components';
import Signup from '../components/Signup';
import Signin from '../components/Signin';
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SigninPage = () => (
  <Columns>
    <Signin />
    <Signup />
    <RequestReset />
  </Columns>
);

export default SigninPage;