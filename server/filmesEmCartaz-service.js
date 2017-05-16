var parser = require('xml2json');
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




  query= "SELECT "+
  "distinct "+
  "tbTitulo.idTitulo id,"+
  "tbTitulo.nome,"+
  "tbTitulo.selecionado,"+
  "tbTitulo.qtacessos,"+
  "tbFilme.genero, "+
  "tbFilme.sinopse, "+
  "tbFilme.poster, "+
  "tbFilme.classificacao, "+
  "tbFilme.duracao, "+
  "tbFilme.notaimdb, "+
  "tbFilme.imagem "+
  "FROM "+
  config.database + ".tbtitulo tbTitulo,"+
  config.database + ".tbfilme tbFilme,"+
  config.database + ".tbtitulofilme tbtitulofilme "+
  "where "+
  "tbTitulo.idTitulo = tbtitulofilme.idTitulo and "+
  "tbFilme.idfilme = tbtitulofilme.idfilme and "+
  "(tbFilme.tipo IN ("+filtro+") or tbFilme.tipo3d IN ("+filtro+")) order by qtacessos desc, nome asc";

  console.log(query);

  
  /*
  query="select distinct idfilme id, nome, genero, sinopse, poster, classificacao, duracao, notaimdb, imagem,tipo, qtacessos, sala, tipo3d, false selecionado from easymovie.tbfilme " +
  "where (tipo IN ("+filtro+") or tipo3d IN ("+filtro+")) order by qtacessos desc, nome asc" ;
  

  query = "SELECT distinct tbTitulo.*, tbfilme.genero, tbfilme.sinopse, tbfilme.poster, tbfilme.classificacao, tbfilme.duracao, tbfilme.notaimdb, tbfilme.imagem FROM easymovie.tbtitulo tbTitulo,easymovie.tbfilme tbFilme where tbTitulo.nome = tbfilme.nome and "+
          "(tbfilme.tipo IN ("+filtro+") or tbfilme.tipo3d IN ("+filtro+")) order by tbTitulo.nome";
*/

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
