// Handles connection and interaction with the mongodb client

const MongoClient = require('mongodb').MongoClient;
const { MongoMemoryServer } = require('mongodb-memory-server');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27017';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;
let DATABASE = null;

const dbCollections = ['cooking', 'baking'];

// DELETE, just for checking mongoclient methods
//this.client = new MongoClient(uri).db();

// Handles the Mongo database(db) client connection
class DBClient {
    constructor () {
        this.client = null;
        this.db = null;

        if (process.env.MODE === 'prod') {
            DATABASE = 'mycookbook-db';
        } else if (process.env.MODE === 'dev') {
            DATABASE = 'mycookbook-dev-db';
        } else {
            DATABASE = 'mycookbook-tester-db';
        }
    }

    async connect() {
        try {
            this.client = await MongoClient.connect(url);
            this.db = this.client.db(DATABASE);
            console.log('Database connection successful.');
        } catch (error) {
            this.db = false;
            console.log(`Error connecting to DB Client: ${error.message}`);
        }        
    }

    /**
     * Provides an in-memory database interface for testing purposes.
     */
    async connectTestDb() {
        try {
            this.mongoServer = new MongoMemoryServer();
            const mongoUri = await mongoServer.getUri();
            const client = new MongoClient(mongoUri);
            await client.connect();
            this.db = client.db(DATABASE);
        } catch (error) {
            this.db = false;
            console.log(`Error connecting in-memory test DB: ${error.message}`);;
        }
    }

    /**
     * Disconnects the in-memory database interface for testing purposes.
     */
    async disconnectTestDb() {
        if (this.mongoServer) {
            try {
                await this.mongoServer.cleanup();
                await this.mongoServer.stop();
            } catch (error) {
                console.log(`Error disconnecting in-memory test DB: ${error.message}`);
            }
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

const dbClient = new DBClient(DATABASE);

module.exports = {
    DBClient,
    dbClient
}