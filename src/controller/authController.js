// Provides functionality for all authentication endpoints
const bcrypt = require('bcrypt');
const authService = require('../services/authServices');

/**
 * Registers a new user into the database.
 * all args from req.body expected to be validated with validation middleware
 * Sends status code:
 * 201 for successful registration of a user.
 * @param {Request} req the http request interface
 * @param {Response} res the http response interface
 */
const userRegistration = async (req, res) => {
    const { name, username, email } = req.body;
    const { password, confirmedPwd } = req.body;
    
    // if validation middleware for this endpoint found an issue
    if (req.error) {
        return res.status(req.status).json({error: req.error});
    }

    let hashedPwd = null;
    if (password === confirmedPwd) {
        try {
            hashedPwd = bcrypt.hashSync(password, 10);
        } catch (error) {
            console.log(`Error while hashing password: ${error}`);
            return res.status(500).json({error: `Server-side error while hashing password: ${error}`});
        }
    } else {
        return res.status(400).json({error: 'Password and confirmed passsword do not match'});
    }

    const user = {
        name,
        username,
        email,
        hashedPwd,
        recipes: [],
        role: 'normal',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const result = await authService.insertUser(user);
    if (!result) {
        console.log('Server-side error while registering new user.');
        return res.status(500).json({error: 'Server-side error. Apologies for the inconvenience.'});
    }

    req.session.authenticated = true;
    req.session.user = {
        usersame: user.username, role: user.role
    }

    res.status(201).json({
        message: 'User registered successfully.', userId: result.insertedId
    });
}

/**
 * Logs user into the application.
 * 
 * Any misinformation or errors are responded with accordingly.
 * @param {Request} req the http request
 * @param {Response} res the http response
 */
const userLogin = async (req, res) => {
    const { password } = req.body;

    if (req.session.authenticated) {
        return res.status(200).json({message: 'You are already logged in.'});
    }

    if (req.error) { // an error occured in validation middleware
        return res.status(req.status).json({error: req.error});
    }  

    const user = await authService.findUser(req.field, req.identifier);
    if (!user) {
        return res.status(401).json({error: 'Username, email or password is incorrect.'});
    }

    try {
        if (!bcrypt.compareSync(password, user.hashedPwd)) {
            return res.status(401).json({error: 'Username, email or password is incorrect.'});
        }
    } catch (error) {
        console.log(`Error while comparing hashed password: ${error}`);
        return res.status(500).json({error: 'Server-side error. Apologies for the inconvenience.'});
    }

    req.session.authenticated = true;
    req.session.user = {
        usersame: user.username, role: user.role
    }
    
    res.status(200).json({message: 'Login successful.'});
}

module.exports = {
    userRegistration,
    userLogin
}