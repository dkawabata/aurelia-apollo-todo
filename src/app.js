import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import TODOS from './graphql/Todos.gql';
import INSERT_TODO from './graphql/InsertTodo.gql';

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
  todoDescription = ''

  constructor() {
    client.query({
      query: TODOS
    }).then(data => this.todos = data.data.todos);
  }

  addTodo() {
    if (this.todoDescription) {
      client.mutate({
        mutation: INSERT_TODO,
        variables: { description: this.todoDescription },
        update: (store, { data }) => {
          let { todos } = store.readQuery({ query: TODOS });
          todos.push(data.insert_todos.returning[0]);
          store.writeQuery({
            query: TODOS,
            data: { 'Todos': todos }
          });
        }
      });
      this.todoDescription = '';
    }
  }
}
