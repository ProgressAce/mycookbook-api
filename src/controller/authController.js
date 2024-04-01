// Provides functionality for all authentication endpoints
const bcrypt = require('bcrypt');
const authService = require('../services/authServices');

/**
 * Registers a new user into the database.
 * Sends status code:
 * 201 for successful registration of a user.
 * @param {Request} req the http request interface
 * @param {Response} res the http response interface
 */
const user_registration = async (req, res) => {
    const { name, username, email } = req.body;
    const { password, confirmedPwd } = req.body;

    // all args from req.body expected to be validated with authentication
    // Middleware validation.

    let hashedPwd = null;
    if (password === confirmedPwd) {
        try {
            hashedPwd = bcrypt.hashSync(password, 10);
        } catch (error) {
            console.log(`Error while hashing password: ${error}`);
            return res.status(500).json({error: `Error while hashing password: ${error}`});
        }
    } else {
        return res.status(400).json({error: 'Password and confirmed passsword do not match'});
    }

    const user = {
        name,
        username,
        email,
        hashedPwd,
        role: 'normal',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const result = await authService.insertUser(user);
    if (!result) {
        return res.status(500).json({error: 'Server-side error trying to register new user'});
    }

    res.status(201).json({message: 'User registered successfully.', friendlyId});
}

module.exports = {
    user_registration
}