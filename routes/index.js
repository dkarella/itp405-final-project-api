var express = require('express');
var router = express.Router();

/* Controllers */
var AuthController = require('../controllers/auth');
var MusicianController = require('../controllers/musician');
var MusicController = require('../controllers/music');
var MeController = require('../controllers/me');
var TagController = require('../controllers/tag');

/* Middleware */
var authorize = require('../middleware/authorize');
var admin = require('../middleware/admin');
var photoUpload = require('../middleware/upload-photo');
var musicUpload = require('../middleware/upload-music');

/* Admin Routes */
router.all('/admin/*', admin);
router.post('/admin/validate', AuthController.validate_admin);
router.get('/admin/musicians', MusicianController.adminGetAll);
router.get('/admin/musicians/:id', MusicianController.adminGet);
router.delete('/admin/musicians/:id', MusicianController.adminRemove);
router.get('/admin/tags', TagController.adminGetAll);
router.get('/admin/tags/:id', TagController.adminGet);
router.delete('/admin/tags/:id', TagController.adminRemove);
router.get('/admin/music', MusicController.adminGetAll);
router.get('/admin/music/:id', MusicController.adminGet);
router.delete('/admin/music/:id', MusicController.adminRemove);
router.delete('/admin/musician-tag/:musicianId/:tagId', MusicianController.adminRemoveMusicianTag)

/* Musican Routes */
router.get('/musicians', MusicianController.search);
router.get('/musicians/:id', MusicianController.getById);

/* Authentication Routes */
router.post('/register', AuthController.register);
router.post('/request_token', AuthController.request_token);
router.post('/validate_token', authorize, AuthController.validate_token);

/* Me Routes */
router.all('/me/*', authorize); // all me routes require token
router.get('/me', authorize, MeController.fetch_current_musician);
router.post('/me/picture', photoUpload.single('file'), MeController.uploadPicture);
router.post('/me/music', musicUpload.single('file'), MeController.uploadMusic);
router.post('/me/tag', MeController.addTag);
router.delete('/me/tag/:id', MeController.removeTag);
router.delete('/me/music/:id', MeController.removeMusic);

/* Static Content (Photos/Music) */
router.use(express.static(__dirname + '/../uploads'));

module.exports = router;
