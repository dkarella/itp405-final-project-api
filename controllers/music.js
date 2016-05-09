var Music = require('../models').Music;
var Musician = require('../models').Musician;

module.exports = {
  adminGetAll(req, res){
    Music.findAll(
      {
        include: [
          { model: Musician }
        ]
      }
    ).then(
      function(tags){
        return res.json({'admin-music': tags});
      });
  },

  adminGet(req, res){
    var id = req.params.id;
    Music.findOne({
      where: {id: id},
      include: [
        {model: Musician}
      ]
    }).then(
      function(music){
        return res.json({'admin-music': music})
      });
  },

  adminRemove(req, res){
    var id = req.params.id;
    Music.destroy({where: {id: id}}).then(function(){
      return res.json({message: `Music '${id}' has been removed.`});
    }, function(error){
      return res.json({error: error});
    });
  }
}
