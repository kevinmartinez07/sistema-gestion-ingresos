import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang='en'>
    <Head>
      <link rel='icon' type='image/svg+xml' href='/favicon.svg?v=2' />
      <link rel='shortcut icon' type='image/svg+xml' href='/favicon.svg?v=2' />
      <link rel='apple-touch-icon' sizes='180x180' href='/favicon.svg?v=2' />

      <meta name='theme-color' content='#3b82f6' />
      <meta
        name='description'
        content='Sistema de Gestión de Ingresos - Administra tus finanzas de manera eficiente'
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
