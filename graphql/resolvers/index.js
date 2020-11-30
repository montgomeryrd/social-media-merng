const postsResolvers = require('./posts.js');
const usersResolvers = require('./users.js');
const commentsResolvers = require('./comments.js');

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}