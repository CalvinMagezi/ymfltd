import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '@/components/utils/Layout'
import Head from 'next/head'
import NProgress from 'nprogress'
import { useState } from 'react'
import Loader from '@/components/Loader'
import Router from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)

  if (loading) return <Loader />

  Router.events.on('routeChangeStart', (url) => {
    // console.log("Router is changing");
    NProgress.start()
    setLoading(true)
  })

  Router.events.on('routeChangeComplete', (url) => {
    // console.log("Router changing is complete");
    NProgress.done()
    setLoading(false)
  })
  return (
    <ChakraProvider>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
