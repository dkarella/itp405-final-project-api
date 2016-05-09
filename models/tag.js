var db = require('../config').db;
var Sequelize = require('sequelize');

var Tag = db.define('tag', {
    value: {
      type: Sequelize.STRING,
      field: 'value'
    },
    type: {
      type: Sequelize.INTEGER,
      field: 'type'
    }
  },
  {
    timestamps: false,
  });

module.exports = Tag;
