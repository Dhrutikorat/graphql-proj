import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import axios from 'axios';

async function createServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String
                email: String
                username: String
                phone: String
                website: String
            }

            type Todo {
                id: ID!
                title: String!
                userId: ID
                completed: Boolean
                user: User!
            }

            type Query {
                getTodos: [Todo]
                getUsers: [User]
                getUserById(id: ID!): User
            } 
        `,
        resolvers: {
            Todo: {
                user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
            },
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUserById: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        }
    });

    await server.start();

    app.use(cors());
    app.use(bodyParser.json());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        }),
    );

    app.listen(8000, () => console.log(`Server running at port 8000`));
}

createServer();