const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

// Creating server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = 3000 || process.env.PORT;

// useNewUrlParser depracated, using useUnifiedTopology
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen(PORT);
    })
    .then(res => {
        console.log(`Listening on ${res.url}`);
    }
);