var PROPERTIES = require('./mock-datasDisponiveis').data
var parser = require('xml2json');
var mysql      = require('mysql');



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'easymovie',
  port     : '3306'
});


function findAll(req, res, next) {
  var query;
  var post;

  query="SELECT data, false 'selecionado' FROM easymovie.tbdata;";

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
