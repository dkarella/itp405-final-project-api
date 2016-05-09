var QueryParser = require('../services/query-parser');
var chai = require('chai');
var expect = chai.expect;

describe('QueryParser', function(){
  it('parseByTags(q) should return SQL OR object to check if any tags will be like  \
      any word (separated by \'+\') in the query', function(){

      var query = 'test+query+string';
      var correctResult = {
        $or: [
          {
            value: {
              $like: '%'+'test'+'%'
            }
          },
          {
            value: {
              $like: '%'+'query'+'%'
            }
          },
          {
            value: {
              $like: '%'+'string'+'%'
            }
          }
        ]
      }

      var actualResult = QueryParser.parseByTags(query);

      expect(actualResult).to.eql(correctResult);
  });

  it('parseByName(q) should return SQL OR object to check if any first or last names will be like  \
      any word (separated by \'+\') in the query', function(){

      var query = 'test+query+string';
      var correctResult = {
        $or: [
          {
            firstName: {
              $like: '%'+'test'+'%'
            }
          },
          {
            lastName: {
              $like: '%'+'test'+'%'
            }
          },
          {
            firstName: {
              $like: '%'+'query'+'%'
            }
          },
          {
            lastName: {
              $like: '%'+'query'+'%'
            }
          },
          {
            firstName: {
              $like: '%'+'string'+'%'
            }
          },
          {
            lastName: {
              $like: '%'+'string'+'%'
            }
          }
        ]
      }

      var actualResult = QueryParser.parseByName(query);

      expect(actualResult).to.eql(correctResult);
  });
});
