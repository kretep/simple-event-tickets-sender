import { setContext } from 'apollo-link-context';
import { gql } from 'graphql-tag';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from "@apollo/client";
import fetch from 'cross-fetch';
import { sha256 } from 'js-sha256';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL,
  fetch
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.HASURA_SELLER_TOKEN;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const createTicket = (order_id, name, email, type, sell_date) => {
  const checkins_left = type == "1" ? 5 : 1;
  const valueToHash = name + email + sell_date + Math.random().toString();
  console.log(valueToHash);
  const code = sha256(valueToHash).substring(0, 10);
  
  order_id = 0; ///TODO~!!!!! ****

  let values = {
    order_id,
    name,
    email,
    type,
    checkins_left,
    code,
    sell_date: sell_date,
    create_date: sell_date,
    log: ""
  }
  console.log(values);

  return client
    .query({
      query: gql`
      query fetchTicket($code: String!) {
        tickets(where: {code: {_eq: $code}}) {
          checkins_left
          type
          code
        }
      }
      `,
      variables: {
        code: "qwerty"
      }
    })
    .then(result => {
      console.log(result);
      return code;
    })
    .catch(error => {
      console.log(error);
      return null;
    });
}
