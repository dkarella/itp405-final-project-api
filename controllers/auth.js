var bcrypt = require('bcrypt-nodejs');
var secret = require('../config').secret;
var Auth = require('../models').Auth;
var Musician = require('../models').Musician;
var jwt = require('jsonwebtoken');

module.exports = {
  register(req, res){
    // TODO: Validation

    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;

    // Create Musician profile
    Musician.build({
      firstName: firstName,
      lastName: lastName
    }).save()
      .then((musician) => {
        console.log(musician);
        var musicianId = musician.dataValues.id;

        // hash the password
        bcrypt.hash(password, null, null, (err, hash) => {
          if(err){
            // if there is an error creating the auth profile, remove musician
            musician.destroy().then(() => {
              return res.status(422).json({
                error: 'Error creating user. 2'
              });
            });
          } else {
            Auth.build({
              username: username,
              hash: hash,
              musicianId: musicianId
            }).save()
              .then((auth) => {
                // create session variable
                var session = {
                  authId: auth.dataValues.id,
                  musicianId: musicianId,
                };

                // create jwt using session variable, expires in 24 hours
                var token = jwt.sign(session, secret, {expiresIn: 86400});

                return res.json({
                  message: 'Successfully created new user!',
                  token: token
                })
              })
              .catch((error) => {
                // if there is an error creating the auth profile, remove musician
                musician.destroy().then(() => {
                  return res.status(422).json({
                    error: 'Error creating user. 3'
                  });
                });
              });
          }
        });

      })
      .catch((error) => {
        console.log(error);
        return res.status(422).json({
          error: 'Error creating user. 1',
          details: error
        })
      });
  },

  // validate username / password, generate a jwt and set jwt as cookie
  request_token(req, res){
    var username = req.body.username;
    var password = req.body.password;

    // find the user in the database
    Auth.findOne({
      where: {username: username}
    }).then((auth) => {
      if(auth){
        // compare the password given with the hash in the database
        bcrypt.compare(password, auth.hash, function(err, result) {
          if(err) return res.status(422).json({error: 'Something went wrong. Try again.'});
          else if(result === false) return res.status(401).json({error: 'Invalid username/password.'});

          // create session variable
          var session = {
            authId: auth.id,
            musicianId: auth.musicianId,
            isAdmin: auth.isAdmin === 1 ? true : false
          };

          // create jwt using session variable, expires in 24 hours
          var token = jwt.sign(session, secret, {expiresIn: 86400});

          // send token to client
          return res.json({message: 'Login successful', token:token});
        });
      } else {
        return res.status(404).json({error: 'Invalid username/password.'});
      }

    }).catch((error) => {
      console.log(error);
      return res.status(422).json({message: 'Error looking for user in database'});
    });
  },

  validate_token(req, res){
    // if request reaches here, it has a valid token,
    res.json({message: 'Token is valid.'})
  },

  validate_admin(req, res){
    // if request reaches here, it has a valid admin token,
    res.json({message: 'Admin is valid.'})
  },
};
