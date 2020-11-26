const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User.js');

module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            // Validate User Data

            // Makes sure User doesn't already exist

            // Hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jsonwebtoken.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}