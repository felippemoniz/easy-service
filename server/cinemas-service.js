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
  var filtro = req.params.filtro;

  query= "select * FROM "+ config.database + ".tbcinema"

  console.log("Consultei os cinemas");

  pool.query(query, function(err, rows, fields) {
      if(err) {
        throw err;
      }else{
        res.json(rows);
      }

  });

}

function findCinemaPorSessao(req, res, next) {
  var query;
  var post;
  var id = req.params.id;
  var data = req.params.data;


  query=  "SELECT distinct tbcinema.nome, tbcinema.idcinema, 1 selecionado FROM " +
  config.database + ".tbfilme tbfilme, " +
  config.database + ".tbsessao tbsessao, " +
  config.database + ".tbcinema tbcinema " +
  "where  " +
  "tbfilme.idfilme in ("+id+") and " +
  "tbfilme.idfilme = tbsessao.idfilme and "+
  "tbsessao.idcinema = tbcinema.idcinema and " +
  "tbsessao.data = '"+data+"'"


  pool.query(query, id, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });

}


function findById(req, res, next) {
    var id = req.params.id;
    res.json(PROPERTIES[id - 1]);
}


function like(req, res, next) {
    var property = req.body;
    PROPERTIES[property.id - 1].likes++;
    res.json(PROPERTIES[property.id - 1].likes);
}





exports.findAll = findAll;
exports.findById = findById;
exports.like = like;
exports.findCinemaPorSessao = findCinemaPorSessao;
