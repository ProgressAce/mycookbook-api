# Mycookbook API 

Pull request test using TRAG
A place to store and manage your online and offline recipes, creating your own personal online cookbook.
Whether you're the type who stores all their favourite links in one place, or you're the type who has to scour the web for that great recipe you found last month.
This project aims to create a space for you to manage all the online recipes you like so that you can easily find them, save a bit more time and keep up the positive energy a little longer for cooking, baking or whatever your heart fancies.

## Features
* Users can signup or login to their account.
* Only private (authenticated) users can access all the core features. Public (non-authenticated) users need to have an account before they can leverage the application's core features.
* Core features:
    * adding new recipes for storage
    * editing a recipe
    * displaying all recipes

### Installation Guide
* Clone this repository [here](https://github.com/ProgressAce/mycookbook-api.git).
* The develop branch is the most stable branch at any given time, ensure you're working from it.
* Run npm install to install all dependencies
* You can work with the default locally installed MongoDB database or choose a different alternative, but you will need to check if . Do configure to your choice in the application entry file.
* The configuration (config) files are present in the utils folder placed in the src folder of the project root. The two files are for development and testing environments. Should you want one for production, then use "config.dev.js" and "config.testing.js" files as a reference.

Suggested use of the config files would be as follows:
```nodejs
let envConfig = null;
try {
    const env = process.env.NODE_ENV || 'dev';
    envConfig = require(`./config.${env}.js`);
} catch (error) {
    console.log("No config file for the specified environment.")
}
console.log(envConfig.DB_NAME);
```

### Usage
* Run ```npm run devStart``` at the project's root folder to start the application.
* Connect to the API using Postman or whichever API testing tool you prefer, on localhost, port 3000.

## API Endpoints
| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| POST | /api/v1/auth/register | To register a new user account |
| POST | /api/v1/user/login | To login an existing user account |
| POST | /api/v1/recipes | To create a new recipe |
| GET | /api/v1/recipe | To retrieve all recipes belonging to the logged in user |

## Technologies Used
* [NodeJS](https://nodejs.org/) A cross-platform runtime environment built on Chrome's V8 JavaScript engine used in running JavaScript codes on the server. It allows for installation and managing of dependencies and communication with databases.
* [ExpressJS](https://www.expresjs.org/) A NodeJS web application framework.
* [MongoDB](https://www.mongodb.com/) A free open source NOSQL document database with scalability and flexibility. Data are stored in flexible JSON-like documents.

### Authors
* [ProgressAce](https://github.com/ProgressAce)

## License
This project is available for use under the MIT License.
