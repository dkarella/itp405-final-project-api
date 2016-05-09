var Tag = require('../models').Tag;
var MusicianTag = require('../models').MusicianTag;
var Musician = require('../models').Musician;
var Q = require('q');

module.exports = {
  adminGetAll(req, res){
    Tag.findAll().then(
      function(tags){
        return res.json({'admin-tags': tags});
      });
  },

  adminGet(req, res){
    var tagId = req.params.id;
    Tag.findOne({
      where: {id: tagId},
      include: [
        { model: Musician }
      ]
    }).then(function(tag){
      return res.json({'admin-tag': tag});
    });
  },

  adminRemove(req, res){
    var tagId = req.params.id;
    Q.all(
      Tag.destroy({where: {id: tagId}}),
      MusicianTag.destroy({where: {tag_id: tagId}})
    ).then(function(){
      return res.json({message: `Tag '${tagId}' and associated MusicianTags have been removed.`})
    }, function(error){
      return res.json({error: error});
    });
  }
}
