const Post = require('../../models/Post.js');

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

module.exports = resolvers;