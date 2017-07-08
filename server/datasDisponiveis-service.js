var mysql      = require('mysql');
var config      = require('./config');



var connection = mysql.createConnection({
      host     : config.host,
      database : config.database,
      user     : config.user,
      password : config.password
});



function findAll(req, res, next) {
  var query;
  var post;

  query="SELECT data, false 'selecionado' FROM "+ config.database + ".tbdata;";


  console.log("Consultei as datas");

  connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);

  });

};


function handleDisconnect() {
  connection = mysql.createConnection({
        host     : config.host,
        database : config.database,
        user     : config.user,
        password : config.password
  });
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}


function findById(req, res, next) {
    var id = req.params.id;
    res.json(PROPERTIES[id - 1]);
}

handleDisconnect();

exports.findAll = findAll;
exports.findById = findById;
