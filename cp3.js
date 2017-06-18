
var mysql      = require('mysql');
var parser = require('xml2json');
var got = require('got');
var fs = require('fs');
var request = require('sync-request');



var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'easymovie'
});



connection.connect();

//################## EXECUCAO DA CARGA DAS TABELAS ######################
console.log("### INICIO DA CARGA ####");
//incluirCinemas(12);
incluirFilmes(12);
console.log("### FIM DA CARGA #####");
//#######################################################################



function incluirCinemas(idcidade){

  var jsonCinemas;
  var res = request('GET', 'https://api-content.ingresso.com/v0/theaters/city/'+idcidade);
  var respostaString = res.getBody().toString();
  jsonCinemas=JSON.parse(respostaString);

  for(var i = 0; i < jsonCinemas.length; i++) {
    console.log (jsonCinemas[i].totalRooms)
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

        query = connection.query('INSERT INTO tbcinema SET ?', post, function(err, result) {console.log(err);});
  }

  console.log("1-Cinemas incluidos");

}



function concatenaGeneros(jsonGenero){
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

function incluirFilmes(idcidade){

  var jsonFilmes;
  var i;
  var res = request('GET', 'https://api-content.ingresso.com/v0/templates/nowplaying/'+idcidade);
  var respostaString = res.getBody().toString();
  jsonFilmes=JSON.parse(respostaString);

  for(i = 0; i < jsonFilmes.length; i++) {

     post  = {
       idfilme : jsonFilmes[i].id,
       nome : jsonFilmes[i].title,
       classificacao : jsonFilmes[i].contentRating,
       duracao : jsonFilmes[i].duration,
       notaimdb : 6,
       sinopse : jsonFilmes[i].synopsis,
       cast : jsonFilmes[i].cast,
       diretor : jsonFilmes[i].director,
       genero : concatenaGeneros(jsonFilmes[i].genres),
       poster : jsonFilmes[i].images[0].url,
       imagem : jsonFilmes[i].images[1].url,
       linktrailer : jsonFilmes[i].trailers[0].url,
       selecionado : 0,
       qtacesso : 0
     }

  //  query = connection.query('INSERT INTO tbfilme SET ?', post, function(err, result) {console.log(err);});

  incluirSessoes(jsonFilmes[i].id,idcidade)


  }

  console.log(i+"-Filmes incluidos");

}


function incluirSessoes(idfilme,idcidade){
  var jsonSessoes;
  var i;
  var res = request('GET', 'https://api-content.ingresso.com/v0/sessions/city/'+idcidade+'/event/'+ idfilme);
  var respostaString = res.getBody().toString();
  jsonSessoes=JSON.parse(respostaString);

  for (var i = 0; i < jsonSessoes.length; i++) {
    console.log(jsonSessoes[i].dayOfWeek)


  }



}















connection.end();
