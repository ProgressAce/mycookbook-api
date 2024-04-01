// Unit tests for the database
import { expect } from 'chai';
import db from '../../utils/db.js';

// Tests database(DB) client
describe("DB Client interaction", function() {
    this.beforeAll('Establish client connection with test database (test env.)', async function () {
        await db.dbClient.connect();
        this.testDb = db.dbClient;
        // if (this.testDb.db.databaseName !== 'mycookbook-testing-db') {
        //     ;
        // }
    });

    this.afterAll(async function () {
        const collections = await this.testDb.db.collections();
        for (const collection of collections) {
            const collectionName = collection.s.namespace.collection;
            await this.testDb.db.dropCollection(collectionName);
        }
        await this.testDb.db.dropDatabase();
        await this.testDb.closeConnection();

    });

    it('established connection with `connect`', async function() {
        expect(this.testDb.db.databaseName).to.be.equal('mycookbook-testing-db');
    });

    it('test connection', function () {
        expect(this.testDb.hasConnection()).to.be.true;
    });
});