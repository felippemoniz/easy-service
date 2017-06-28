var mysql       = require('mysql');
var config      = require('./config');
var http        = require('http');
var request     = require('request');


var connection = mysql.createConnection({
      host     : config.host,
      database : config.database,
      user     : config.user,
      password : config.password
});


function getTop6(req, res, next) {

  var cidade = 12//req.params.cidade
  var respostaString;
  var jsonCinemas;

request('https://api-content.ingresso.com/v0/templates/soon/'+cidade, function (error, response, body) {
  if (!error && response.statusCode == 200) {
        jsonCinemas=JSON.parse(body);
        res.json(jsonCinemas)
  }
})

}


/*
function getTop6(req, res, next) {

 var query;
  var post;
  var filtro = req.params.filtro;


  query= "SELECT * FROM "+config.database +".tbfilme order by qtacesso desc limit 6";

  console.log("Consultei os top 6");

  connection.query(query, function(err, rows, fields) {
      if(err) {
        throw err;
      }else{
        res.json(rows);
      }

  });

}
*/



function findAll(req, res, next) {

  var query;
  var post;
  var filtro = req.params.filtro;

  console.log(filtro)

  query= "SELECT distinct tbfilme.* FROM " +
          config.database +".tbfilme tbfilme,"+
          config.database +".tbsessao tbsessao "+
          "where "+
          "tbfilme.idfilme = tbsessao.idfilme and "+
          "tbsessao.data = '"+ filtro+"' "+
          "order by qtacesso desc, nome asc";

  console.log("Consultei os filmes em cartaz");


  connection.query(query, function(err, rows, fields) {
      if(err) {
        throw err;
      }else{
        res.json(rows);
      }

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
exports.getTop6 = getTop6;
exports.findById = findById;
exports.like = like;
