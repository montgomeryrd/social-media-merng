const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const gql = require('graphql-tag');

const Post = require('./models/Post.js');
const { MONGODB } = require('./config.js');

// Type definitions and Queries
const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Query {
        getPosts: [Post]
    }
`;
// Resolvers for each Query
const resolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        }
    }
};

// Creating server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = 3000 || process.env.PORT;

// useNewUrlParser depracated, added useUnifiedTopology
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen(PORT);
    })
    .then(res => {
        console.log(`Listening on ${res.url}`);
    }
);