import React from 'react';
import Head from 'next/head';
import 'bulma/css/bulma.css';

export default ({children}) => (
  <React.Fragment>
    <Head>
      <meta name="description" content="A simple Notes PWA" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="manifest" href="/static/manifest.webmanifest" />

      <meta name="theme-color" content="#ff6600" />
      <link rel="shortcut icon" href="/static/icon.png" />
      <link rel="apple-touch-icon" href="/static/icon.png" />
      <meta name="apple-mobile-web-app-title" content="Notes PWA" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />

      <title>Note PWA Example</title>
      <link rel="stylesheet" href="/_next/static/style.css" />
    </Head>
    {children}
  </React.Fragment>
);
