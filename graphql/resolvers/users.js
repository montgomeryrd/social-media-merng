const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validaters.js');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User.js');

function generateToken(user) {
    return jsonwebtoken.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = `User does not exist`;
                throw new UserInputError(`User does not exist`, { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = `Incorrect password`;
                throw new UserInputError(`Incorrect password`, { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            // Validate User Data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // Makes sure User doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is unavailable', {
                    errors: {
                        username: `${user} is already in use.`
                    }
                })
            }
            // Hash password and create auth token for a new user
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}