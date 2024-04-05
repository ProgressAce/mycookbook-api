// Defines the session store of the application
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient = require('../utils/redis.js');

// initialise store.
const redisStore = new RedisStore({client: redisClient});

const env = process.env.NODE_ENV || 'dev';

// determine if the cookie's transport should be made secure
let makeCookieSecure;
if (env === 'prod') {
    makeCookieSecure = true;
} else {
    makeCookieSecure = false;
}

// acquire secret from config file
let envConfig;
try {
    envConfig = require(`../utils/config.${env}.js`);
} catch (error) {
    console.log("No config file for the specified environment.");
}

// == Hook up sessions with Redis server client ==
// session manages all the sessions.
// connectRedis handles flushing to in-memory redis store
const configSession = session({
    store: redisStore,
    secret: envConfig.SESSION_SECRET,
    saveUninitialized: false, // if true, it creates a new session ID with every request to the server
    resave: false, // if true, it saves a session's state even if not modified.
    name: 'sessionId',
    cookie: {
        secure: makeCookieSecure, // if true, only transmit cookie over https
        httpOnly: true, // if true, prevents client-side JS from reading the cookie
        maxAge: envConfig.SESSION_COOKIE_AGE // session age in cookie in milliseconds
    }
});

module.exports = {
    configSession,
    redisStore
}