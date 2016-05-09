var multer  = require('multer')
var crypto = require('crypto');
var mime = require('mime');
var musicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/music')
  },
  filename: function (req, file, cb) {
    console.log(file);
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.mp3');
    });
  }
});
var uploadMusic = multer({ storage: musicStorage });

module.exports = uploadMusic;
