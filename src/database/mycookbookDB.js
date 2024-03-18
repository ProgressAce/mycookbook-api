// Handles connection and interaction with the mongodb client

import MongoClient from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_DATABASE = 'mycookbook';
const uri = `mongodb://${DB_HOST}:${DB_PORT}`;

// Handles the Mongo database(db) client connection
class DBClient {
    constructor () {
        MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client) => {
            if (!err) {
                this.client = client.db(DB_DATABASE);
                this.cooking = this.client.collection('cooking');
                this.baking = this.baking.collection('baking');
            } else {
                console.log(`DB Client connection error: ${err.message}`);
            }
        });
    }

    /**
     * 
     */
    isAlive() {
        return this.client.connected;
    }
}

const dbClient = new DBClient();

module.exports = dbClient;