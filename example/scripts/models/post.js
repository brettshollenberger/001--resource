angular.module('app')
  .provider('Post', function() {
    this.$get = ['$resource', function($resource) {
      var Post = $resource('http://localhost:3000/api/post/', {}, {
        update: {
          method: 'PUT'
        },
        cool: {
          method: 'GET',
          isArray: true,
          params: {
            title: {"$gt": "Test"}
          }
        }
      })

      var originalQuery = angular.copy(Post.query);
      Post.watchedCollections = [];

      Post.query = function() {
        var results = originalQuery();
        Post.watchedCollections.push(results);
        return results;
      }

      var originalDelete = angular.copy(Post.delete);

      Post.delete = function(instance) {
        originalDelete(instance);
        delete instance['$$hashKey']
        _.each(Post.watchedCollections, function(watchedCollection) {
          _.remove(watchedCollection, instance);
        });
      }

      return Post;
    }];
  });
