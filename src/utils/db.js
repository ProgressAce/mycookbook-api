// Handles connection and interaction with the mongodb client

const MongoClient = require('mongodb').MongoClient;
const { config } = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27017';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

let envConfig = null;
try {
    const env = process.env.NODE_ENV || 'dev';
    envConfig = require(`./config.${env}.js`);
} catch (error) {
    console.log("No config file for the specified environment.")
}

const dbCollections = ['cooking', 'baking'];

// Handles the Mongo database(db) client connection
class DBClient {
    constructor () {
        this.db = null;
    }

    /**
     * Setup the Database client connection.
     * Connects to the database according to the environment's configuration
     */
    async connect() {
        try {
            const client = await MongoClient.connect(url);
            this.db = client.db(envConfig.DB_NAME);
            console.log('Database connection successful.');
        } catch (error) {
            this.db = false;
            console.log(`Error connecting to DB Client: ${error.message}`);
        }        
    }

    /**
     * Confirms on the connection status of the db client.
     * @returns True if connected, otherwise false.
     */
    hasConnection() {
        return Boolean(this.db);
    }
}

const dbClient = new DBClient();

module.exports = {
    DBClient,
    dbClient
}
