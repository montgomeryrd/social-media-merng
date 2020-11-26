const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');

const { MONGODB } = require('./config.js');

const typeDefs = gql`
    type Query {
        sayHi: String!
    }
`
// Resolvers for each Query
const resolvers = {
    Query: {
        sayHi: () => 'Hello World!'
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const PORT = 3000 || process.env.PORT;

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen(PORT);
    })
    .then(res => {
        console.log(`Listening on ${res.url}`);
    }
);