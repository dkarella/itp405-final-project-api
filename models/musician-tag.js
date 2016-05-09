var db = require('../config').db;
var Sequelize = require('sequelize');

var MusicianTag = db.define('musician_tag',
  {
    musicianId: {
      type: Sequelize.INTEGER,
      field: 'musician_id'
    },
    tag_id: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false,
  });

module.exports = MusicianTag;
