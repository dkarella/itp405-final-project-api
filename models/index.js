var Auth = require('./auth');
var Musician = require('./musician');
var Music = require('./music');
var Tag = require('./tag');
var MusicianTag = require('./musician-tag');

Auth.belongsTo(Musician, {
  foreignKey: 'musician_id'
});

Music.belongsTo(Musician, {
  foreignKey: 'musician_id'
});

Musician.hasMany(Music, {
  foreignKey: 'musician_id'
});

Musician.belongsToMany(Tag, {through: MusicianTag, foreignKey: 'musician_id' });
Tag.belongsToMany(Musician, {through: MusicianTag, foreignKey: 'tag_id' });

module.exports = {
  Auth: Auth,
  Musician: Musician,
  Music: Music,
  Tag: Tag,
  MusicianTag: MusicianTag
};
