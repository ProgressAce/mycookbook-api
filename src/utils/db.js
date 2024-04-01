// Handles connection and interaction with the mongodb client

const MongoClient = require('mongodb').MongoClient;

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
            this.client = await MongoClient.connect(url);
            this.db = this.client.db(envConfig.DB_NAME);
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

    /**
     * Closes the database client connection
     */
    async closeConnection() {
        await this.client.close();
    }

    /**
     * Finds a user in the user collection.
     * A query to find a user, is constructed by dynamically setting the field
     * and value of the field.
     * @param {String} identifier the identifier to find a user with
     * @param {String} field a field used to uniquely find a user with. 
     * @returns the user if found, otherwise null.
     */
    async findUser(field, identifier) {
        try {
            const query = {};
            query[field] = identifier;

            const user = await this.db.collection('users').findOne(query);
            return user;
        } catch (error) {
            console.log(`Error while searching for user: ${error}`);
        }
    }

    /**
     * Inserts one user into the database.
     * @param {Object} userInfo the information of the new user.
     * @returns the mongodb confirmation object if insertion into database
     *          was successful, otherwise undefined.
     */
    async insertUser(userInfo) {
        try {
            const result = await this.db.collection('users').insertOne(userInfo);
            return result;
        } catch (error) {
            console.log(`Error while inserting new user: ${error}`);
            return undefined;
        }
    }

    /**
     * gets all the recipes of the specified category in specified order
     * @param {string} collection specify which category of recipes to retrieve
     * @param {string} order the specified order to retun all the recipes
     */
        async getAllRecipes(collection, order='asc') {
            // data validation
            if ( !(collection instanceof String) ) {
                console.log('DB <getAllRecipes>: <collection> needs to be a string');
                return -1;
            }
    
            if ( typeof order !== 'string' || !(order in ['asc', 'desc']) ){
                console.log('DB <getAllRecipes>: <order> needs to be string \
                            and either `asc` or `desc`.')
                return -1;
            }
    
            try {
                if (collection in dbCollections) {
                    const recipes = await this.client.collection(collection).find().sort({title: 1});
                    return recipes;
                } else {
                    console.log(`collection should be part of ${dbCollections}`);
                    return -1;
                }
            } catch (err) {
                console.log(`db <getAllRecipes> mongo finding error: ${err}`);
                return -1;
            }
        }
    
        async getKeyphrasedRecipe (collection, keyphrase=undefined) {
            if ( !(collection instanceof String) ) {
                console.log('DB <getOneRecipe>: <collection> needs to be a string');
                return -1;
            }
    
            if ( !(keyphrase instanceof String) ) {
                console.log('DB <getKeyphrasedRecipe> keyphrase, should be a string.')
                return -1;
            }
    
            const query = { $text: { $search: keyphrase } };
            const projection = {
                _id: 0,
                title: 1,
            };
    
            try {
                if (collection in dbCollections) {
                    const recipes = await this.client.collection(collection)
                      .find(query).project(projection);
                    return recipes;
                } else {
                    console.log(`DB <getOneRecipe> collection, should be part of ${dbCollections}`);
                    return -1;
                }
            } catch (err) {
                console.log(`db <getKeyphrasedRecipe> mongo finding error: ${err}`);
                return -1;
            }
        }
    
        //
        async getOneRecipe (collection, keyphrase=undefined) {
            if ( !(collection instanceof String) ) {
                console.log('DB <getOneRecipe>: <collection> needs to be a string');
                return -1;
            }
    
            if ( !(keyphrase instanceof String) ) {
                console.log('DB <getAllRecipes>: <order> needs to be string \
                            and either `asc` or `desc`.')
                return -1;
            } 
    
            if (collection in dbCollections) {
                //if () {}
                const recipes = await this.client.collection(collection).find().sort();
                return recipes;
            } else {
                console.log(`DB <getOneRecipe> collection, should be part of ${dbCollections}`);
                return -1;
            }
        }
    
        //all cooking||baking recipes // sorted
        //get specific recipes with key phrase
        //get specific recipes
        //create a recipe
        // update a recipe
        // delete a recipe
        // add feedback to a recipe
}

const dbClient = new DBClient();

module.exports = {
    DBClient,
    dbClient
}
