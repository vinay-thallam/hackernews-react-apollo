import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import { BrowserRouter } from 'react-router-dom'

import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants';

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri : 'ws://localhost:4000/',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
})

const authLink = setContext(( _, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization : token ? `Bearer ${token}`: ''
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/'
})

const link = split(({query}) => {
  const {kind, operation} = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription'
}, wsLink, authLink.concat(httpLink))

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


//One way of making graphql query using apollo client.
client.query({
  query: gql`
    {
      feed {
        links {
          id
        }
      }
    }
  `
}).then(response => console.log(response.data.feed))