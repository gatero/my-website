var async = require('async');

module.exports = function(app) {
  
  var mysql_ds = app.dataSources.mysql_ds;
  
  async.parallel({
    admins: async.apply( createAdmins )
  }, function( error, results ){
    createPosts( results.admins, function( error ){
      console.log(' > Models created sucessfully !');
    });
  });

  function createAdmins( callback ){

    mysql_ds.automigrate('Admin', function( error ){
      if ( error ) throw error;

      var Admin = app.models.Admin;

      Admin.create([
        {email: 'daniel@gatero.mx', password: 'bendecida'}
      ], callback);

    });

  };

  function createPosts( admins, callback ){

    mysql_ds.automigrate('Post', function( error ){
      if ( error ) return callback( error );

      var Post = app.models.Post;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

      Post.create([
        {
          date: Date.now() - ( DAY_IN_MILLISECONDS * 4 ),
          lastUpdated: Date.now(),
          title: 'Titulo de prueba',
          content: 'Contenido de prueba',
          adminId: admins[0].id
        }
      ], callback);

    });
  }
};
