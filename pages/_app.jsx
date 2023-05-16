import '@/styles/globals.css'
// import type { AppProps } from 'next/app'
import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client';


const client = new ApolloClient({
  link: createUploadLink({
    uri: '/api/graphql',
  }),
  cache: new InMemoryCache()
})

export default function App({ Component, pageProps }) {
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}
