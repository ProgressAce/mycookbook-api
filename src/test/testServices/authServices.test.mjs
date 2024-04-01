// Unit tests for `authentication/authorization` of the services layer
import { expect } from 'chai';
import authServices from '../../services/authServices.js';
import { dbClient } from '../../utils/db.js';

// Test functions for authentication & authorization purposes
describe('Functions for authentication and authorization needs', function () {
    const isValidEmail = authServices.isValidEmail;
    const isValidPassword = authServices.isValidPassword;
    const findUser = authServices.findUser;
    const generateFriendlyId = authServices.generateFriendlyId;
    const insertUser = authServices.insertUser;

    this.beforeAll(async function () {
        await dbClient.connect();
        this.testDb = dbClient;
        this.databaseName = this.testDb.db.databaseName;
    });

    this.afterAll(async function () {
        await this.testDb.db.dropCollection('users');
        await this.testDb.db.dropDatabase();
        await this.testDb.closeConnection();
    });

    // Has complete dependency on the `deep-email-validator` module.
    describe('isValidEmail function', function () {
        // valid emails from academy.test.io
        const email1 = 'dummy@example.com';
        const email2 = 'test.io.example+today@epam.com';

        // invalid emails from academy.test.io
        const invEmail1 = 'test.io.com';
        const invEmail2 = 'test@io@epam.com';

        it.skip('validates that email looks like an email.', async function () {
            const mail1 = await isValidEmail(email1);
            const mail2 = await isValidEmail(invEmail1)

            expect(mail1.valid).to.be.true;  // the emails given for testing don't seem to be real
            expect(mail2.valid).to.be.false;  // works fine
        });

        it.skip('validates MX records on dns.', function () {
            ;
        })

        it.skip('validates the SMTP Server existence.', function () {
            ;
        });

        it.skip('validates mailbox existence on SMTP Server', function () {
            ;
        });
    });

    describe('isValidPassword function', function () {
        it('Ensures password is passed as a string.', function () {
            expect(isValidPassword('I am a 5tring!')).to.be.true;
            expect(isValidPassword({movie: 'Turbo'})).to.be.false;
            expect(isValidPassword(5653131465)).to.be.false;
        });
        it('Ensures password is at least 8 characters long.', function () {
            expect(isValidPassword('Seven@95')).to.be.true;
            expect(isValidPassword('Tim^5')).to.be.false;
        })
        it('Ensures password has at least one uppercase letter', function () {
            expect(isValidPassword('I am a 5tring!')).to.be.true;
            expect(isValidPassword('all_lowercase0')).to.be.false;
        });
        it('Ensures password has at least one lowercase letter', function () {
            expect(isValidPassword('I am a 5tring!')).to.be.true;
            expect(isValidPassword('UPPERCASE_0VERWHELMS')).to.be.false;
        });
        it('Ensures password has at least one special character', function () {
            expect(isValidPassword('J4mes$Bond')).to.be.true;
            expect(isValidPassword('J4mesBond')).to.be.false;
        });
        it('Ensures password has at least one digit character', function () {
            expect(isValidPassword('Smelt=Iron6')).to.be.true;
            expect(isValidPassword('Smelt=Iron')).to.be.false;
        });
    });

    // Relies entirely on the findUser method from the DBClient class.
    describe('findUser function', function () {
        this.beforeAll(async function () {
            if (this.databaseName === 'mycookbook-testing-db') {
                // the data layer has no validation or user schema protection
                await this.testDb.db.collection('users')
                .insertOne({name: 'Second son', email: 'abacus@testing.io'});
            }
        });

        it('finds an existing user in the database.', function () {
            if (this.databaseName === 'mycookbook-testing-db') {
                expect(findUser('abacus@testing.io')).to.not.be.undefined;
            } else {
                this.skip();
            }
        });

        it('returns undefined for a non-existing user in the database.', async function () {
            if (this.databaseName === 'mycookbook-testing-db') {
                expect(findUser('dummy@testing.io')).to.be.undefined;
            } else {
                this.skip();
            }
        });
    });

    describe('generateFriendlyId function', function () {
        it('generates a friendlyID based off of a username.', function () {
            const username = 'seniordev';
            const friendlyId = generateFriendlyId(username);
            expect(typeof friendlyId).to.be.equal('string');
            expect(friendlyId).to.match(/^seniordev-[a-z0-9]{5}$/);
        });
        it('handles a username with uppercase letters.', function () {
            const username = 'SeniOrdeV';
            const friendlyId = generateFriendlyId(username);
            expect(friendlyId).to.match(/^seniordev-[a-z0-9]{5}$/);
        });
        it('handles a username with special characters', function () {
            const username = 'Senior.Dev@';
            const friendlyId = generateFriendlyId(username);
            expect(friendlyId).to.match(/^seniordev-[a-z0-9]{5}$/);
        });
        it('does not exclude the digits for the friendlyID in the username', function () {
            const username = '5eniord3v';
            const friendlyId = generateFriendlyId(username);
            expect(friendlyId).to.match(/^5eniord3v-[a-z0-9]{5}$/);
        });
        it('can handle all the uppercase and special characters together.', function () {
            const username = 'Sen!)r.d3v';
            const friendlyId = generateFriendlyId(username);
            expect(friendlyId).to.match(/^senrd3v-[a-z0-9]{5}$/);
        });
    });

    // Depends entirely on the DBClient class's insertUser method.
    describe('insertUser function', function () {
        it.skip('it inserts one user into the `users` collection.', function () {});
    });
})

