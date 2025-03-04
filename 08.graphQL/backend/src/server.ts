import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dotenv from "dotenv";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

// Initialize dotenv so it reads our `.env`-file
dotenv.config();

// Read port to start server on from `.env`, otherwise default to port 4000
const PORT = Number(process.env.PORT) || 4000;


// Set up the Apollo Server
const server = new ApolloServer({
    resolvers: resolvers,
    typeDefs: typeDefs,
});


// Start a standalone server on the specified port
startStandaloneServer(server, {
        listen: {
            port: PORT,
        },
    })
    .then(props => {
        console.log(`🚀GraphQL server ready at: ${props.url}`);
    })
    .catch(err => {
        console.error(`📛GraphQL server could not start because: `, err);
        process.exit(1);
    });