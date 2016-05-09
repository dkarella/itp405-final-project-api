var db = require('../config').db;
var Sequelize = require('sequelize');

var Music = db.define('music', {
    musicianId: {
      type: Sequelize.INTEGER,
      field: 'musician_id'
    },
    title: {
      type: Sequelize.STRING,
      field: 'title'
    },
    path: {
      type: Sequelize.STRING,
      field: 'path'
    }
  },
  {
    timestamps: false,
    tableName: 'music'
  });

module.exports = Music;
