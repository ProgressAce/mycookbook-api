// Configuration for testing environment

module.exports = {
    DB_NAME: 'mycookbook-testing-db',
    SESSION_SECRET: 'mySmallSecret',
    SESSION_COOKIE_AGE: 1000 * 10 // Equals 10 seconds ( 1000ms per 1sec )
}