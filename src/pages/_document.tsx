import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://cdn.ucsd.edu/cms/decorator-5/styles/teko.css"
            rel="stylesheet"
          />
          <link
            rel="icon"
            href="https://cdn.ucsd.edu/developer/decorator/5.0.2/favicon.ico"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
