import React from 'react';
import Head from 'next/head';
import 'bulma/css/bulma.css';

export default ({children}) => (
  <React.Fragment>
    <Head>
      <title>Note PWA Example</title>
      <link rel="stylesheet" href="/_next/static/style.css" />
    </Head>
    {children}
  </React.Fragment>
);
