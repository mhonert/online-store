import React from 'react';
import Header from "./Header";
import Meta from "./Meta";
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offwhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

const StyledPage = styled.div`
  background: white;
  color: ${({theme}) => theme.black};
`

const Inner = styled.div`
  max-width: ${({theme}) => theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`

injectGlobal`
  html {
    box-sizing: border-box;;
    font-size: 10px;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: sans-serif;
  }
  
  a {
    text-decoration: none;
    color: ${theme.black};
  }
`

const Page = ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <Meta/>
        <Header/>
        <Inner>
          {children}
        </Inner>
      </StyledPage>
    </ThemeProvider>
  );
};

export default Page;