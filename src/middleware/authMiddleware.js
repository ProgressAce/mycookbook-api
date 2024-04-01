// defining middleware operations for all auth needs
const express = require('express');
const dbClient = require('../utils/db.js').dbClient;
const authService = require('../services/authServices.js');

/**
 * Validates all the arguments in the request body,
 * parsed as json.
 * @param {Request} req the http request interface
 * @param {Response} res the http response interface
 * @param {import('express').NextFunction} next calls the next middleware function
 * @returns appropriate status code and messages for invalid input
 *          given by the user.
 */
const validateRegistrationInput = async (req, res, next) => {
    const { name, username, email } = req.body;
    const { password, confirmedPwd } = req.body;
    let user = null;
        
    // validate arguments from the request body 
    if (!name) {  
        req.status = 400;
        req.error = 'Please enter your name.';
        next(); // error not passed, otherwise status code 500 would be send
        return;
    }
    if (!username) {
        req.status = 400;
        req.error = 'Please enter your username.';
        next();
        return;
    }
    if (!email) {
        req.status = 400;
        req.error = 'Please enter your email.';
        next();
        return;
    }
    if (!password) {
        req.status = 400;
        req.error = 'Please enter your password.';
        next();
        return;
    }
    if (!confirmedPwd) {
        req.status = 400;
        req.error = 'Please enter your confirmed password.';
        next();
        return;
    }

    // Using dbClient's findUser method makes the one from authServices obsolete
    // TODO: Refactor authService's function to find user with other fields.
    //       Stop using dbClient directly unless absolutely necessary.
    
    if (typeof name !== 'string') {
        req.status = 400;
        req.error = 'Please enter a valid name.';
        next();
        return;
    }
    if (username.length < 3 || typeof username !== 'string') {
        req.status = 400;
        req.error = 'Please enter a username of at least four characters.';
        next();
        return;
    }

    user = await dbClient.findUser('username', name);
    if (user) {
        req.status = 400;
        req.error = 'This username is unavailable.';
        next();
        return;
    }
        
    const validEmail = await authService.isValidEmail(email);
    if (!validEmail.valid) {
        req.status = 400;
        req.error = `Please provide a valid email address, ',
                    reason: ${validEmail.validators[validEmail.reason].reason}`;
        next();
        return;
    }

    if (!authService.isValidPassword(password)) {
        req.status = 400;
        req.error = 'Please provide a valid password (mentioned in docs)';
        next();
        return;
    }

    // look for existing email
    user = await authService.findUser(email);
    if (user) {
        req.status = 409;
        req.error = 'User with this email already exists.';
        next();
        return;
    }
    next();
}

module.exports = {
    validateRegistrationInput
}