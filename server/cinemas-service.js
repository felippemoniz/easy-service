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
  var filtro = req.params.filtro;

  query= "select idcinema,nomecinema,latitude,longitude,selecionado,qtacessos FROM "+ config.database + ".tbcinema"


  console.log("Consultei os cinemas");


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
exports.findById = findById;
exports.like = like;
