var mysql      = require('mysql');
var config      = require('./config');



var connection = mysql.createConnection({
      host     : config.host,
      database : config.database,
      user     : config.user,
      password : config.password
});




function findAll(req, res, next) {
}



function findById(req, res, next) {
  var query;
  var post;
  var id = req.params.id;
  var data = req.params.data;
  var preferencia = req.params.preferencia;

  console.log(preferencia)

  query="select * "+
  "from " +
   config.database + ".tbtitulo tbTitulo," +
   config.database + ".tbfilme tbFilme," +
   config.database + ".tbtitulofilme tbtitulofilme," +
   config.database + ".tbcinema tbcinema," +
   config.database + ".tbhorario tbhorario " +
  "where " +
  "tbTitulo.idTitulo in ("+id+") and  " +
  "tbTitulo.idTitulo = tbtitulofilme.idTitulo and " +
  "tbFilme.idfilme = tbtitulofilme.idfilme and " +
  "tbhorario.data='"+data.substring(0,10)+"' and " +
  "tbhorario.idfilme = tbFilme.idfilme and " +
  "tbhorario.idcinema = tbcinema.idcinema and " +
  "tbTitulo.idTitulo = tbtitulofilme.idTitulo and " +
  "tbFilme.idfilme = tbtitulofilme.idfilme and" +
  "(tbFilme.tipo IN ("+preferencia+") or tbFilme.tipo3d IN ("+preferencia+"))" +
  "order by horario asc";

  console.log("Consultei as sessões escolhidas");

  /*
  query="select * from easymovie.tbFilme filme, easymovie.tbhorario horario, easymovie.tbcinema cinema where horario.idfilme in ("+id+") and  horario.data='"+data.substring(0,10)+"' and horario.idfilme = filme.idfilme and horario.idcinema = cinema.idcinema order by horario asc";
  */
  
  connection.query(query, id, function(err, rows, fields) {
      if (err) throw err;
      contabilizaAcesso(id);
      res.json(rows);
  });
  
}


function findNow(req, res, next) {
  var query;
  var post;
  var dataAtual = new Date();
  var horaAtual = dataAtual.getHours().toString() + dataAtual.getMinutes().toString();
  var horaAtualMais2Horas = calculaHoraFim(dataAtual.getHours().toString() + ":" + dataAtual.getMinutes().toString(),120)

  //query = "select * from easymovie.tbFilme filme, easymovie.tbhorario horario, easymovie.tbcinema cinema where horario.data='"+retornaDataAtual()+"' and horario.idfilme = filme.idfilme and horario.idcinema = cinema.idcinema and horario between "+horaAtual+" and "+horaAtualMais2Horas+" order by horario asc";
query = "select * from  " + config.database + ".tbfilme filme, " + config.database + ".tbhorario horario, " + config.database + ".tbcinema cinema where horario.data='2017-04-07' and horario.idfilme = filme.idfilme and horario.idcinema = cinema.idcinema and horario between "+horaAtual+" and "+horaAtualMais2Horas+" order by horario asc";

console.log("Consultei as sessões AGORA");

  connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
  
}



function retornaDataAtual(){
  var dataAtual = new Date();
  var dia = ("0" + (dataAtual.getDate())).slice(-2)
  var mes = ("0" + (dataAtual.getMonth() + 1)).slice(-2)
  var ano = dataAtual.getFullYear();

  return ano + "-" + mes + "-" + dia;
}




function calculaHoraFim(time, minsToAdd) {
  function z(n){
    return (n<10? '0':'') + n;
  }
  var bits = time.split(':');
  var mins = bits[0]*60 + (+bits[1]) + (+minsToAdd);

  return z(mins%(24*60)/60 | 0) + '' + z(mins%60);  

}  




function contabilizaAcesso(id){

  query="UPDATE  " + config.database + ".tbtitulo SET qtacessos = qtacessos + 1  WHERE idTitulo in ("+ id + ")";

  console.log("Contabilizei os acessos")

  connection.query(query, id, function(err, rows, fields) {
      if (err) throw err;
  });

}


function like(req, res, next) {
    var property = req.body;
    PROPERTIES[property.id - 1].likes++;
    res.json(PROPERTIES[property.id - 1].likes);
}

exports.findAll = findAll;
exports.findById = findById;
exports.like = like;
exports.findNow = findNow;
