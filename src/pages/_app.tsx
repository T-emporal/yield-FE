import "@/styles/globals.css";
import Head from 'next/head'
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'


export default function App({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>Temporal</title>
        <meta name="description" content="Decentralized Finances" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <GoogleTagManager gtmId="GTM-K9ZLZWNS" />
      <GoogleAnalytics gaId="G-3D9QN4RQ7Q" />
    </>
  )
}
