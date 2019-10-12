process.env.NODE_ENV = 'test';

// Module dependencies
const User = require('../models/user');
require('dotenv').config();
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server.js');
let should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);


before(async function () {
    await User.deleteMany({});
});


describe('POST: /api/user - Create User', function () {

    it('should return error code (403) if authentication token is not supplied', function (done) {
        const newUser = {
            name: 'John',
            email: 'john@gmail.com',
            mobile: '+919877887733',
            gender: 'Male',
            age: 35
        };
        chai.request(server)
            .post('/api/user')
            .send(newUser)
            .end(function (err, res) {
                res.status.should.equal(403);
                done();
            });
    });

    it('should return error code (401) if invalid authentication token is supplied', function (done) {
        const newUser = {
            name: 'John',
            email: 'john@gmail.com',
            mobile: '+919877887733',
            gender: 'Male',
            age: 35
        };
        chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.WRONG_AUTH_TOKEN)
            .send(newUser)
            .end(function (err, res) {
                res.status.should.equal(401);
                done();
            });
    });

    it('should create new user', function (done) {
        const newUser = {
            name: 'John',
            email: 'john@gmail.com',
            mobile: '+919877887733',
            gender: 'Male',
            age: 35
        };
        chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(newUser)
            .end(function (err, res) {
                res.status.should.equal(201);
                expect(res.body).to.have.property("name", newUser.name);
                expect(res.body).to.have.property("email", newUser.email);
                expect(res.body).to.have.property("gender", newUser.gender);
                expect(res.body).to.have.property("age", newUser.age);
                done();
            });
    });

    it('should not create new user - empty request body', function (done) {
        chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send({})
            .end(function (err, res) {
                res.status.should.equal(400);
                done();
            });
    });

    it('should not create new user - email is not unique', async function () {
        const newUser = {
            name: 'Ramesh',
            email: 'ramesh@gmail.com',
            mobile: '+919877887734',
            gender: 'Male',
            age: 40
        };
        const user = new User(newUser);
        await user.save();
        const res = await chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(newUser);
        res.status.should.equal(500);
    });

    it('should not create new user - name is not supplied', function (done) {
        const newUser = {
            email: 'raghav@gmail.com',
            mobile: '+919877887733',
            gender: 'Male',
            age: 35
        };
        chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(newUser)
            .end(function (err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    it('should not create new user - email is not supplied', function (done) {
        const newUser = {
            name: 'Reshma',
            mobile: '+919877883333',
            gender: 'Female',
            age: 28
        };
        chai.request(server)
            .post('/api/user')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(newUser)
            .end(function (err, res) {
                res.status.should.equal(500);
                done();
            });
    });

});

describe('GET: /api/users - Read All Users', function () {

    it('should return error code (403) if authentication token is not supplied', function (done) {
        chai.request(server)
            .get('/api/users')
            .end(function (err, res) {
                res.status.should.equal(403);
                done();
            });
    });

    it('should return error code (401) if invalid authentication token is supplied', function (done) {
        chai.request(server)
            .get('/api/users')
            .set('Authorization', process.env.WRONG_AUTH_TOKEN)
            .end(function (err, res) {
                res.status.should.equal(401);
                done();
            });
    });

    it('should retrieve all users', function (done) {
        chai.request(server)
            .get('/api/users')
            .set('Authorization', process.env.AUTH_TOKEN)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.should.be.a('array');
                res.body.length.should.not.be.eql(0);
                done();
            });
    });
});

describe('GET: /api/user/:id - Read user by id', function () {

    it('should return error code (403) if authentication token is not supplied', function (done) {
        chai.request(server)
            .get('/api/user/1')
            .end(function (err, res) {
                res.status.should.equal(403);
                done();
            });
    });

    it('should return error code (401) if invalid authentication token is supplied', function (done) {
        chai.request(server)
            .get('/api/user/1')
            .set('Authorization', process.env.WRONG_AUTH_TOKEN)
            .end(function (err, res) {
                res.status.should.equal(401);
                done();
            });
    });

    it('should read user details by user id', async function () {
        const newUser = {
            name: 'Vinita',
            email: 'vinita@gmail.com',
            mobile: '+919988887734',
            gender: 'Female',
            age: 30
        };
        const user = new User(newUser);
        await user.save();
        const res = await chai.request(server)
            .get('/api/user/' + user._id)
            .set('Authorization', process.env.AUTH_TOKEN);
        res.status.should.equal(200);
        expect(res.body).to.have.property("name", newUser.name);
        expect(res.body).to.have.property("email", newUser.email);
        expect(res.body).to.have.property("gender", newUser.gender);
        expect(res.body).to.have.property("age", newUser.age);
    });

    it('should not read user details - user not found', function (done) {
        chai.request(server)
            .get('/api/user/5da1fd003688ac19e6d60e73')
            .set('Authorization', process.env.AUTH_TOKEN)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('PUT: /api/user/:id - Update user detils by id', function () {

    it('should return error code (403) if authentication token is not supplied', function (done) {
        chai.request(server)
            .put('/api/user/5da1fd003688ac19e6d60e73')
            .end(function (err, res) {
                res.status.should.equal(403);
                done();
            });
    });

    it('should return error code (401) if invalid authentication token is supplied', function (done) {
        chai.request(server)
            .put('/api/user/5da1fd003688ac19e6d60e73')
            .set('Authorization', process.env.WRONG_AUTH_TOKEN)
            .end(function (err, res) {
                res.status.should.equal(401);
                done();
            });
    });

    it('should update user details', async function () {
        const newUser = {
            name: 'Megha',
            email: 'megha@gmail.com',
            mobile: '+919988899734',
            gender: 'Female',
            age: 32
        };
        const user = new User(newUser);
        await user.save();

        const updatedUser = {
            name: 'Megha',
            email: 'megha@gmail.com',
            mobile: '+919988899734',
            gender: 'Female',
            age: 28
        }
        const res = await chai.request(server)
            .put('/api/user/' + user._id)
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(updatedUser);
        res.status.should.equal(200);
        expect(res.body).to.have.property("name", updatedUser.name);
        expect(res.body).to.have.property("email", updatedUser.email);
        expect(res.body).to.have.property("gender", updatedUser.gender);
        expect(res.body).to.have.property("age", updatedUser.age);
    });

    it('should not update user details - user not found', function (done) {

        const updatedUser = {
            name: 'Megha',
            email: 'megha@gmail.com',
            mobile: '+919988899734',
            gender: 'Female',
            age: 28
        }
        chai.request(server)
            .put('/api/user/5da1fd003688ac19e6d92e73')
            .set('Authorization', process.env.AUTH_TOKEN)
            .send(updatedUser)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });

});


describe('DELETE: ', function () {
});