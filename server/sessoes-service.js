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



function getDates(req, res, next) {
var data = req.params.data;

handleDisconnect();
query="SELECT distinct(data),diasemana, 0 selecionado FROM "+config.database+".tbsessao " +
      "where data >= '"+data+"' order by data asc"

  connection.query(query, function(err, rows, fields) {
      if (err) throw err;
      res.json(rows);
  });
}



function findById(req, res, next) {
  var query;
  var post;
  var id = req.params.id;
  var data = req.params.data;

  handleDisconnect();
  query=  "SELECT * , tbfilme.nome nomeFilme, tbcinema.nome nomeCinema FROM " +
  config.database + ".tbfilme tbfilme, " +
  config.database + ".tbsessao tbsessao, " +
  config.database + ".tbcinema tbcinema " +
  "where  " +
  "tbfilme.idfilme in ("+id+") and " +
  "tbfilme.idfilme = tbsessao.idfilme and "+
  "tbsessao.idcinema = tbcinema.idcinema and " +
  "tbsessao.data = '"+data+"'" +
  "order by hora "


  console.log("Consultei as sessões escolhidas");

  connection.query(query, id, function(err, rows, fields) {
      if (err) throw err;
      contabilizaAcesso(id);
      res.json(rows);
  });

}


function findByTheater(req, res, next) {
  var query;
  var post;
  var id = req.params.id;
  var data = req.params.data;

  handleDisconnect();
  query=  "SELECT * , tbfilme.nome nomeFilme, tbcinema.nome nomeCinema FROM " +
  config.database + ".tbfilme tbfilme, " +
  config.database + ".tbsessao tbsessao, " +
  config.database + ".tbcinema tbcinema " +
  "where  " +
  "tbcinema.idcinema in ("+id+") and " +
  "tbfilme.idfilme = tbsessao.idfilme and "+
  "tbsessao.idcinema = tbcinema.idcinema and " +
  "tbsessao.data = '"+data+"'" +
  "order by hora "

  console.log("Consultei as sessões por cinemas escolhidas");

  connection.query(query, id, function(err, rows, fields) {
      if (err) throw err;
       res.json(rows);

  });



}



function findNow(req, res, next) {
  var query;
  var post;
  var data = req.params.data;

  ano = data.substring(0,4)
  mes = data.substring(5,7);
  dia = data.substring(8,10);
  hora = data.substring(11,13);
  minuto = data.substring(14,17);


  var dataAtual = new Date(ano,parseInt(mes)-1,dia,hora,minuto);
  var dataReduzida = ano + "-" + mes + "-" + dia;

  var horaAtual = ("0" + (dataAtual.getHours())).slice(-2) + ("0" + (dataAtual.getMinutes())).slice(-2);
  var horaAtualMais2Horas = calculaHoraFim(dataAtual.getHours().toString() + ":" + dataAtual.getMinutes().toString(),120)




  handleDisconnect();
  query=  "SELECT * , tbfilme.nome nomeFilme, tbcinema.nome nomeCinema FROM " +
  config.database + ".tbfilme tbfilme, " +
  config.database + ".tbsessao tbsessao, " +
  config.database + ".tbcinema tbcinema " +
  "where  " +
  "tbfilme.idfilme = tbsessao.idfilme and "+
  "tbsessao.idcinema = tbcinema.idcinema and " +
  "tbsessao.data = '"+dataReduzida+"' and "+
  "hora between "+horaAtual+" and "+horaAtualMais2Horas+ " order by hora "

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

  query="UPDATE  " + config.database + ".tbfilme SET qtacesso = qtacesso + 1  WHERE idFilme in ("+ id + ")";
  console.log("Contabilizei os acessos")
  handleDisconnect();
  connection.query(query, id, function(err, rows, fields) {
      if (err) throw err;
  });

}

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

function like(req, res, next) {
    var property = req.body;
    PROPERTIES[property.id - 1].likes++;
    res.json(PROPERTIES[property.id - 1].likes);
}

exports.findAll = findAll;
exports.findById = findById;
exports.like = like;
exports.findNow = findNow;
exports.findByTheater = findByTheater;
exports.getDates = getDates;
