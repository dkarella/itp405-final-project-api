var Musician = require('../models').Musician;
var Auth = require('../models').Auth;
var Tag = require('../models').Tag;
var Music = require('../models').Music;
var MusicianTag = require('../models').MusicianTag;
var queryParser = require('../services/query-parser');
var Q = require('q');

module.exports = {
  search(req, res){
    var query = req.query.q;

    if(!query){
      return res.json({musicians: []});
    }

    var nameQuery = queryParser.parseByName(query);
    var tagQuery = queryParser.parseByTags(query);

    Q.all([
      Musician.findAll({
        where: nameQuery
      }),
      Tag.findAll({
        where: tagQuery,
        include: [
          {model: Musician}
        ]
      })
    ]).then(function(response){
      var musicianResponse = response[0];
      var tagResponse = response[1]

      var musicians = [];

      // add musicians from the musicianResponse
      if(musicianResponse.length > 0){
        var musiciansFromResponse = musicianResponse.map(function(res){
          return res.dataValues;
        })

        musicians = musicians.concat(musiciansFromResponse);
      }

      // add musicians from the tagResponse
      if(tagResponse.length > 0){
        console.log(tagResponse);
        var musiciansFromTagResponse = tagResponse.map(function(tag){
          // get the musicians
          return tag.musicians;
        }).reduce(function(total, current){
          // combine all of the arrays
          return total.concat(current);
        }).map(function(musician){
          delete musician.dataValues["musician_tag"];
          return musician.dataValues;
        });

        musicians = musicians.concat(musiciansFromTagResponse);
      }

      // filter out repeated musicians
      if(musicians.length > 2){
        var uniqueMusicians = {};
        musicians = musicians.filter(function(musician){
          if(uniqueMusicians[musician.id]){
            return false;
          }
          uniqueMusicians[musician.id] = true;
          return true;
        });
      }

      return res.json({musicians: musicians});
    }).catch(function(err){
      return res.json(err);
    });
  },

  getById(req, res){
    Musician.findOne({
      where: {id: req.params.id},
      include: [
          { model: Music },
          { model: Tag }
      ]
    }).then((musician)=>{
        return res.json({musician: musician})
      })
      .catch(()=>{
        return res.status(404).json({musician: {}});
      });
  },

  adminGetAll(req, res){
    Musician.findAll().then(
      function(musicians){
        return res.json({'admin-musicians': musicians});
      });
  },

  adminGet(req, res){
    var id = req.params.id;
    Musician.findOne({
      where: {id: id},
      include: [
        {model: Tag},
        {model: Music}
      ]
    }).then(
      function(musician){
        return res.json({'admin-musician': musician})
      });
  },

  adminRemove(req, res){
    var id = req.params.id;
    Q.all(
      Musician.destroy({where: {id: id}}),
      Auth.destroy({where: {musicianId: id}}),
      Music.destroy({where: {musicianId: id}}),
      MusicianTag.destroy({where: {musicianId: id}})
    ).then(function(){
      return res.json({message: `Musician '${id}' and associated models have been removed.`})
    }, function(error){
      return res.json({error: error});
    });
  },

  adminRemoveMusicianTag(req, res){
    var musicianId = req.params.musicianId;
    var tagId = req.params.tagId;

    MusicianTag.destroy({
      where: {
        musicianId: musicianId,
        tag_id: tagId
      }
    }).then(function(){
      return res.json({message: `Musician '${musicianId}' and tag '${tagId}' have been disassociated.`});
    });
  }
};
