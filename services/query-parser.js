/*
  This module takes a raw query string from the client and
  converts it into a manner that can be used to query SQL.
*/

module.exports = {
    parseByTags(q){
      var keywords = q.split('+');
      var $or = [];

      keywords.forEach((keyword)=>{
       $or.push({
          value: {
            $like: `%${keyword}%`
          }
        });
      });

      return {$or: $or};
  },
  parseByName(q){
    var keywords = q.split('+');
    var $or = [];

    keywords.forEach((keyword)=>{
      $or.push({
        firstName: {
          $like: `%${keyword}%`
        }
      });

      $or.push({
        lastName: {
          $like: `%${keyword}%`
        }
      });
    });

    return {$or: $or};

  }
}
