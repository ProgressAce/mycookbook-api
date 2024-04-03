// Defines the Redis Client connection
const redis = require('redis');

// configure redis instance
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});
redisClient.connect().catch((error) => {
    console.log(`Error while connecting redis client: ${error}`);
});

module.exports = redisClient;