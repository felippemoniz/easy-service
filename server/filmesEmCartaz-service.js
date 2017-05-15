var PROPERTIES = require('./mock-filmesEmCartaz').data
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
  var filtro = req.params.filtro;




  query= "SELECT "+
  "distinct "+
  "tbTitulo.idTitulo id,"+
  "tbTitulo.nome,"+
  "tbTitulo.selecionado,"+
  "tbTitulo.qtacessos,"+
  /*"tbfilme.genero, "+*/
  "tbfilme.sinopse, "+
  "tbfilme.poster, "+
  "tbfilme.classificacao, "+
  "tbfilme.duracao, "+
  "tbfilme.notaimdb, "+
  "tbfilme.imagem "+
  "FROM "+
  process.env.MYSQL_ADDON_DB + ".tbtitulo tbTitulo,"+
  process.env.MYSQL_ADDON_DB + ".tbfilme tbFilme,"+
   process.env.MYSQL_ADDON_DB + ".tbtitulofilme tbtitulofilme "+
  "where "+
  "tbtitulo.idTitulo = tbtitulofilme.idTitulo and "+
  "tbfilme.idfilme = tbtitulofilme.idfilme and "+
  "(tbfilme.tipo IN ("+filtro+") or tbfilme.tipo3d IN ("+filtro+")) order by qtacessos desc, nome asc";

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
