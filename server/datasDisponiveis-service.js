var PROPERTIES = require('./mock-datasDisponiveis').data
var parser = require('xml2json');
var mysql      = require('mysql');



var connection = mysql.createConnection({
      host     : process.env.MYSQL_ADDON_HOST,
      database : process.env.MYSQL_ADDON_DB,
      user     : process.env.MYSQL_ADDON_USER,
      password : process.env.MYSQL_ADDON_PASSWORD
});



function findAll(req, res, next) {
  var query;
  var post;

  query="SELECT data, false 'selecionado' FROM "+ process.env.MYSQL_ADDON_DB + ".tbdata;";

console.log(query);

  connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
};


function findById(req, res, next) {
    var id = req.params.id;
    res.json(PROPERTIES[id - 1]);
}


exports.findAll = findAll;
exports.findById = findById;
