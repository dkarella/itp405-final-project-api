/*
  This middleware is to be used by routes that require the admin to be logged in.
*/

var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

module.exports = function(req, res, next){
  var token = req.body.token || req.query.token || req.headers.token;

  if(!token) return res.status(401).json({message: 'Please log in first!'});

  // verifies secret and checks exp
  jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    } else {
      // if token is good, save session to the request for use in other routes
      if(decoded.isAdmin){
          req.session = decoded;
          next();
      } else {
        return res.status(401).json({message: 'Only the admin can access this route.'});
      }
    }
  });
};
