import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://cdn.ucsd.edu/cms/decorator-5/styles/bootstrap.min.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.ucsd.edu/cms/decorator-5/styles/base.min.css"
            rel="stylesheet"
          />
          <link
            rel="icon"
            href="https://www.ucsd.edu/favicon.ico"
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
