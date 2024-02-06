import "@/styles/globals.css";
import Head from 'next/head'

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>Temporal</title>
        <meta name="description" content="Decentralized Finances" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
