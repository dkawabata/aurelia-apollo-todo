import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import TODOS from './graphql/Todos.gql';
import INSERT_TODO from './graphql/InsertTodo.gql';
import UPDATE_TODO from './graphql/UpdateTodo.gql';
import REMOVE_TODO from './graphql/RemoveTodo.gql';

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

  updateTodo(todo) {
    client.mutate({
      mutation: UPDATE_TODO,
      variables: { uuid: todo.uuid, done: todo.done }
    });
  }

  removeTodo(todo) {
    client.mutate({
      mutation: REMOVE_TODO,
      variables: { uuid: todo.uuid },
      update: (store, { data }) => {
        let { todos } = store.readQuery({ query: TODOS });
        const index = todos.findIndex(t => t.uuid === data.delete_todos.returning[0].uuid);
        if (index > -1) {
          todos.splice(index, 1);
        }
        store.writeQuery({
          query: TODOS,
          data: { 'Todos': todos }
        });
      }
    });
  }
}
