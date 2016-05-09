var app = require('../app');
var secret = require('../config').secret;
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var jwt = require('jsonwebtoken');

describe('Authorize Middleware', function(){
    it('should drop a request to a protected route if no token is given', function(done){
      request(app)
        .post('/api/v1/validate_token')
        .expect(200, done);
    });

    it('should drop a request to a protected route if an invalid token is given', function(done){
      request(app)
        .post('/api/v1/validate_token')
        .send({token: 'GIBBERISH-TOKEN'})
        .expect(401, done);
    });

    it('should allow a request to a protected route if a valid token is given', function(done){
      // create test session variable
      var session = {
        authId: '1',
        musicianId: '1',
        isAdmin: false
      };

      // create jwt using test session variable
      var token = jwt.sign(session, secret);

      request(app)
        .post('/api/v1/validate_token')
        .send({token: token})
        .expect(200, done);
    });

});
