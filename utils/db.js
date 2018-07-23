var util = module.exports;
const config = require('./config/config');
const rdb = require('rethinkdb');

util.setup = function (callback) {
  rdb.connect(config.database).then(function (conn) {
    rdb.dbCreate(config.database.db).run(conn).then((result) => {
      console.log('Database created...', result);
    }).error((err) => {
      console.log('Database already present...', err);
      /***
       * If you want to create n number of documents, you can use limit().
       * The database returns a cursor object. As you iterate through the cursor,
       * the server will send documents to the client in batches as they are requested.
       * 
       * **/
      rdb.table('VOTE_LIST').limit(1).run(conn, (err, cursor) => {
        var promise;
        if (!err) {
          // object.toArray() convert (key: value) into [key, value]
          promise = cursor.toArray();
        } else {
          // Table not present
          console.log('Creating table.....');
          promise = rdb.tableCreate('VOTE_LIST').run(conn);
        }
        /**
         * If table present set the update listener
         */
        promise.then((result) => {
          rdb.table('VOTE_LIST').changes().run(conn).then((cursor) => {
            cursor.each((err, row) => {
              if (!err) {
                callback(row)
              }
            })
          })
        })
      })
    })
  })
}

util.saveVote = function (vote, callback) {
    rdb.connect(config.database).then((conn)=> {
        rdb.table('VOTE_LIST').insert(vote).run(conn).then((result)=> {
            
        })
    })
}
