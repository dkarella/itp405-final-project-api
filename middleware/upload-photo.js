var multer  = require('multer')
var crypto = require('crypto');
var mime = require('mime');
var photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var uploadPhoto = multer({ storage: photoStorage });

module.exports = uploadPhoto;
