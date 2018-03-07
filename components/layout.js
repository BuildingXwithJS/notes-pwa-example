import React from 'react';
import Head from 'next/head';

export default ({children}) => (
  <React.Fragment>
    <Head>
      <title>Note PWA Example</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
    </Head>
    {children}
  </React.Fragment>
);
