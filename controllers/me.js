/*
  Me Controller is responsible for any routes that involve the user
  making the request
*/
var Music = require('../models').Music;
var Musician = require('../models').Musician
var Tag = require('../models').Tag;
var Validator = require('validatorjs');

module.exports = {
  fetch_current_musician(req, res){
    // if request reaches here, it has a valid token,
    // send session's musician profile
    Musician.findOne({
      where: {id: req.session.musicianId},
      include: [
        { model: Music },
        { model: Tag }
      ]
    })
      .then((musician) => {
        return res.json({me: musician});
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).json({message: 'Failed to find musician.'});
      });

  },

  uploadPicture(req, res){
    // file uploaded is in req.file
    // get the user's musician profile
    Musician.findById(req.session.musicianId)
      .then((musician)=>{

        musician.picture = 'photos/'+req.file.filename;
        musician.save();
        res.json({message: 'successfully uploaded file.'})
      })
      .catch(()=>{

        res.status(422).json({error: 'Failed to upload picture.'});
      });
  },

  uploadMusic(req, res){
    // file uploaded is in req.file
    // get the user's musician profile
    var title = req.body.title;
    console.log('title!');
    console.log(title);

    var validation = new Validator(
      { title: title },
      { title: 'required|min:5|max:45'}
    );

    if(validation.fails()){
      return res.status(422).json({error: 'invalid title'});
    }

    Music.create({
      musicianId: req.session.musicianId,
      path: 'music/'+req.file.filename,
      title: title
    }).then(
      function(music){
        // send music file
        res.json({music: music});
      },
      function(err){
        console.log(err);
        res.status(422).json({error: 'Failed to upload music file.'});
      });
  },

  addTag(req, res){
    var value = req.body.value;
    var type = req.body.type;

    var validation = new Validator(
      {
        value: value,
        type: type
      },
      {
        value: 'required|min:3|max:45',
        type: 'required|numeric|min:0|max:1'
      }
    );

    if(validation.fails()){
      return res.status(422).json({error: 'failed to validate tag'});
    }

    var newTag = {};
    console.log('type!');
    console.log(type);
    Tag.findOrCreate({where: {value: value, type: type}}).then(
      function(tags){
        newTag = tags[0];
        return tags[0].addMusician(req.session.musicianId);
      },
      function(err){
        console.log(err);
        return res.status(422).json({error: 'Failed to find or create tag.'});
      }).then(
      function(tags){
        return res.json({newTag: newTag});
      },
      function(err){
        console.log(err);
        return res.status(422).json({error: 'Failed to associate musician with tag.'});
      });

  },

  removeTag(req, res){
    var tagId = req.params.id;
    Musician.findById(req.session.musicianId)
      .then((musician)=>{
        musician.removeTag(tagId);
        res.json({message: 'tag has been removed.'});
      })
      .catch(()=>{
        res.status(422).json({error: 'Failed to delete tag.'});
      });
  },

  removeMusic(req, res){
    var musicId = req.params.id;
    Music.destroy({
      where: {
        id: musicId,
        musicianId: req.session.musicianId
      }
    }).then(()=>{
        res.json({message: 'music has been removed.'});
      })
      .catch(()=>{
        res.status(422).json({error: 'Failed to delete music.'});
      });
  }
}
