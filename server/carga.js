var mysql      = require('mysql');
var config      = require('./config');
var request = require('sync-request');



var pool  = mysql.createPool({
      host     : config.host,
      database : config.database,
      user     : config.user,
      password : config.password
});


var valoresInsert =[];
var valoresInsertFilmes = [];



function truncateTable(req, res, next){
  var idtabela = req.params.idtabela;
  if (idtabela=="sessao"){
      var query1 = pool.query('delete from '+ config.database + '.tbsessao', function(err, fields) {console.log(err);});
      console.log("Apaguei as sessoes")
  }

  if (idtabela=="filme"){
      var query2 = pool.query('delete from '+ config.database + '.tbfilme', function(err, fields) {console.log(err);});
      console.log("Apaguei os filmes")
  }

  res.json({resposta: "Tabelas Apagadas!"})
}





function incluirCinema(req, res, next){

 var idcidade = req.params.idcidade;
 var jsonCinemas;
  var i;
  var res = request('GET', 'https://api-content.ingresso.com/v0/theaters/city/'+idcidade);
  var respostaString = res.getBody().toString();
  jsonCinemas=JSON.parse(respostaString);

  for(i = 0; i < jsonCinemas.length; i++) {
     post  = {
        idcinema : jsonCinemas[i].id,
        imagem : jsonCinemas[i].images[0].url,
        nome : jsonCinemas[i].name,
        endereco : jsonCinemas[i].address,
        complemento : jsonCinemas[i].addressComplement,
        idCidade : jsonCinemas[i].cityId,
        nomeCidade :jsonCinemas[i].cityName,
        estado : jsonCinemas[i].state,
        uf : jsonCinemas[i].uf,
        telefone : jsonCinemas[i].telephones[0],
        latitude : jsonCinemas[i].geolocation.lat,
        longitude : jsonCinemas[i].geolocation.lng,
        qtsalas : jsonCinemas[i].totalRooms,
        selecionado : 0,
        qtacesso : 0 }

        query = pool.query('INSERT INTO '+ config.database + '.tbcinema SET ?', post, function(err, result) {
            if (err) {console.log(err);}
        });
  }

  res.json({resposta: "Cinemas incluídos"})

}




function concatenaVetor(jsonGenero){
  var generos="";
   for (var i = 0; i < jsonGenero.length; i++) {
      generos = generos + jsonGenero[i] + ",";
   }

   if (generos != ""){
     return generos.substring(0,generos.length-1);

   }else{
     return generos;
   }
}


function terminaConexao(req, res, next){

	pool.end(function (err) {
	  res.json({resposta: "Finalizou conexão!"})
	});

}


function incluirFilmes(req, res, next){


  console.log("inicio filme")
  var idcidade = req.params.idcidade;
  var jsonFilmes;
  var i;
  var trailer;
  var res = request('GET', 'https://api-content.ingresso.com/v0/events/city/'+idcidade);
  var respostaString = res.getBody().toString();
  jsonFilmes=JSON.parse(respostaString);

  for(i = 0; i < jsonFilmes.length; i++) {

     //#Tratando campos nao obrigatórios antes de incluir
     if (jsonFilmes[i].trailers[0]) {
         trailer = jsonFilmes[i].trailers[0].url;
      }
     //-------------------------------------------------

    valoresInsertFilmes.push([jsonFilmes[i].id,
      jsonFilmes[i].title,
      jsonFilmes[i].contentRating,
      jsonFilmes[i].duration,
      6,
      jsonFilmes[i].synopsis,
      jsonFilmes[i].cast,
      jsonFilmes[i].director,
      concatenaVetor(jsonFilmes[i].genres),
      jsonFilmes[i].images[0].url,
      jsonFilmes[i].images[1].url,
      trailer,0,0
      ])


   incluirSessoes(jsonFilmes[i].id,idcidade)


  }

  query = pool.query('INSERT INTO '+ config.database + '.tbfilme (idfilme,nome,classificacao,duracao,notaimdb,sinopse,cast,diretor,genero,poster,imagem,linktrailer,selecionado,qtacesso) values ?', [valoresInsertFilmes], function(err, result) {
      if (err) {console.log("##Erro na inclusao dos filmes" + err);}
  });

 query = pool.query('INSERT INTO '+ config.database + '.tbsessao (idsessao,data,diasemana,idcinema,idfilme,diames,hora,tipo) values ?', [valoresInsert], function(err, result) {
     if (err) {console.log("##Erro na inclusao das sessoes "+ err);}
 });

  console.log(i+"-Filmes incluidos");


}



function incluirSessoes(idfilme,idcidade){
  var jsonSessoes;
  var jsonCinemas;
  var jsonSalas;
  var jsonRooms;
  var z;
  var idsessao ,data, diasemana,idcinema,idfilme,diames,hora, tipo;
  var respostaString;


  var res = request('GET', 'https://api-content.ingresso.com/v0/sessions/city/'+idcidade+'/event/'+ idfilme);

  if (res.statusCode==200){
        respostaString = res.getBody().toString();
        jsonSessoes=JSON.parse(respostaString);

        for (var i = 0; i < jsonSessoes.length; i++) {
          data = jsonSessoes[i].date;
          diasemana = jsonSessoes[i].dayOfWeek;
          jsonCinemas = jsonSessoes[i].theaters;

              for (var j = 0; j < jsonCinemas.length; j++) {
                idcinema = jsonCinemas[j].id;
                jsonSalas = jsonCinemas[j].rooms;


                for (var k=0; k < jsonSalas.length; k++){
                    jsonRooms = jsonSalas[k].sessions;

                      for (z = 0; z < jsonRooms.length; z++) {
                        idsessao = jsonRooms[z].id;
                        tipo = concatenaVetor(jsonRooms[z].type);
                        hora= jsonRooms[z].date.hour;
                        diames = jsonRooms[z].date.dayAndMonth;

                        valoresInsert.push([idsessao,data,diasemana,idcinema,idfilme,diames,hora.replace(":",""),tipo])

                     }

                }

            }

        }
    }else{
      console.log('Erro nas sessoes do filme:' + idfilme)
    }

console.log("Sessoes desse filme incluidas")

}


exports.incluirFilmes  = incluirFilmes;
exports.incluirCinema  = incluirCinema;
exports.truncateTable  = truncateTable;
exports.terminaConexao = terminaConexao;
