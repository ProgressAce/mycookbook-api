// Unit tests for the database
import { expect } from 'chai';
import db from '../../utils/db.js';
import { Collection } from 'mongodb';

// Tests database(DB) client
describe("DB Client interaction", function() {
    this.beforeAll(async function () {
        await db.dbClient.connect();
        this.testDb = db.dbClient;
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
    })

    it('test connection', function () {
        expect(this.testDb.hasConnection()).to.be.true;
    });
});