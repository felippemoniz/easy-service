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
atualizaSinopsePoster();
console.log("### FIM DA CARGA #####");
//#######################################################################





function atualizaSinopsePoster(){
var json;
var query;

connection.query("SELECT distinct nome FROM easymovie.tbfilme", function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
    	json=recuperaInfo(rows[i].nome);
        if (json.total_results > 0) {
        	query=connection.query('update easymovie.tbfilme SET poster=?, imagem=?, sinopse=?, notaimdb=? WHERE nome = ?', ["https://image.tmdb.org/t/p/w500"+json.results[0].poster_path,"https://image.tmdb.org/t/p/w500"+json.results[0].backdrop_path,json.results[0].overview,json.results[0].imdb, rows[i].nome],  function(err, result) {
        	});
        }
    }
});

}





function recuperaInfo(nome){
	var json = [];
  var id;


	console.log("______________________________")
  	console.log("Vou fazer com :" + nome)
	var res = request('GET', 'http://api.themoviedb.org/3/search/movie?query=&query='+nome+'&language=pt-BR&api_key=5fbddf6b517048e25bc3ac1bbeafb919');
  json=JSON.parse(res.getBody());

/*
  if (json.total_results > 0){
    console.log("Pegando IMDB")
    res2 = request('GET', 'http://www.omdbapi.com/?t='+json.results[0].original_title+'&apikey=5e485ed3');
    json2=JSON.parse(res2.getBody());
    console.log(json2.imdbRating)
    json.results[0].imdb = json2.imdbRating
  }
*/
	console.log("SERVICO OK COM :" + nome)
	return json;

}