var mysql      = require('mysql');
var config      = require('./config');



var pool  = mysql.createPool({
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

  pool.query(query, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
      connection.release();

  });

};





function findById(req, res, next) {
    var id = req.params.id;
    res.json(PROPERTIES[id - 1]);
}



exports.findAll = findAll;
exports.findById = findById;
