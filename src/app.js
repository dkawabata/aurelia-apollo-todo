import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import TODOS from './graphql/Todos.gql';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql'
});

const client = new ApolloClient({
  cache,
  link
});

export class App {
  heading = 'Todos';
  todos = [];

  constructor() {
    client.query({
      query: TODOS
    }).then(data => this.todos = data.data.todos);
  }
}
