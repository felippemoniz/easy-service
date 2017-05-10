
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
gravaDatasDisponiveis();
console.log("### FIM DA CARGA #####");
//#######################################################################






function gravaDatasDisponiveis(){
	   var jsonDatas;
	   var jsonFilmesExistentes
	   var query;
	   var post;
	   var qtInclusoes=0;

	   var res = request('GET', 'http://brasilia.deboa.com/api.php?f=datasDisponiveis');
	   var respostaString = res.getBody().toString();
	   jsonDatas=JSON.parse(respostaString.substring(2,respostaString.length-1));

	   for(var i = 0; i < jsonDatas.length; i++) {
			 post  = {dtcarga: new Date() , data: jsonDatas[i]};
			 query = connection.query('INSERT INTO tbdata SET ?', post, function(err, result) {console.log(err);});
			 gravaFilmesEmCartaz(jsonDatas[i])
	   }
}





function filmeExistentes(){
	var query = connection.query('SELECT distinct(idfilme) from tbfilme', function(err, rows, fields) {
		console.log(err);
	});
	if (query.rows !== undefined){
		return JSON.parse(query.rows);
	}else{
		return null;
	}
}




function gravaSessoes(json,data){


	  for(var i = 0; i < json.length; i++) {

	     for(var j = 0; j < json[i].horario.length; j++) { 
	        	postSessao = {idfilme : json[i].id_filme,
	        				 idcinema : json[i].horario[j].id_localidade,
	        				 horario  : json[i].horario[j].horario,
						 data : data}

				querySessao = connection.query('INSERT INTO tbhorario SET ?', postSessao, function(err, result) {
				//console.log("-----Sessão")
	        	});
	    	}

	   }

}





function isFilmeExiste(json, id){

 if (JSON.stringify(json)=='{}' ){
	 for(var i = 0; i < json.length; i++) {
	    if (json[i] = id){
		return true;
	    }
	 }
	return false;
}
else{
	return false;
}
}



function gravaFilmesEmCartaz(data){

	   var res = request('GET', 'http://brasilia.deboa.com/api.php?f=pesquisa&data='+data);
	   var respostaString = res.getBody().toString();
	   json=JSON.parse(respostaString.substring(2,respostaString.length-1));
   	   var jsonFilmesExistentes

	   jsonFilmesExistentes = filmeExistentes();

	   
	   var jsonDetalhes;
	   var queryFilme;
	   var querySessao;
	   var postFilme;
	   var postSessao;
	   var qtInclusoes=0;
	   var tipo3d;
	   var tipo;
	   var sala;
	   var duracao;
	   var tipoAudio;

	  for(var i = 0; i < json.length; i++) {

	  if (!isFilmeExiste(jsonFilmesExistentes, json[i].id_filme)) {


			nome = json[i].nome;
			tipo3D="";
			tipo="";
			sala="";

			if (nome !=null){

					//console.log("Achei no " + nome + "o 3D, na posicao : "+ nome.indexOf("3D"))

					if (nome.indexOf("3D") > 0 ){
						nome = nome.replace ("3D","");
						tipo3d="3D";
					}

					if (nome.indexOf("sala platinum") > 0){
						sala = "Sala Platinum"
					}

					if (nome.indexOf("SALA VIP")) > 0){
						sala = "Sala Vip"
					}

					if (nome.indexOf("SALA XD")) > 0){
						sala = "Sala XD"
					}

					if (nome.indexOf("POLTRONAS DBOX")) > 0){
						sala = "Sala D-BOX"
					}

					if (nome.indexOf("dublado") > 0 || nome.indexOf("Dublado") > 0){
						//nome = nome.replace ("DUBLADO","");
						tipo="DUBLADO";
					}else if (nome.indexOf("legendado") > 0 || nome.indexOf("Legendado") > 0){
						//nome = nome.replace ("LEGENDADO","");
						tipo="LEGENDADO";
					}

					if (nome.indexOf("(") > 0 ){
						nome = nome.substring (0,nome.indexOf("("));
					}

			}

			if (json[i].duracao != null){
				duracao=json[i].duracao.replace ("minutos","")
			}

    		postFilme = {idfilme: json[i].id_filme ,
        		dtcarga:  new Date(),
        		nome: convert(nome),
        		genero: convert(json[i].genero),
        		classificacao: json[i].classificacao,
        		duracao: duracao,
        		sinopse: json[i].descricao,
        		notaimdb: null,
        		linkimdb: null,
        		linktrailer: null,
        		tipo: tipo,
        		tipo3d : tipo3d,
        		sala: sala,
        		qtacessos: 0}

            	queryFilme = connection.query('INSERT INTO tbfilme SET ?', postFilme, function(err, result) {
            			//console.log("Filme")
			});

		}


	   }

	   gravaSessoes(json,data);

}







connection.end();

function convert(str)
{
if (str !=null){
	str = str.replace("&amp;" , '&' );
	str = str.replace("&lt;" , '<' );
	str = str.replace("&gt;" , '>' );
	str = str.replace("&ordf;" , 'ª' );  
	str = str.replace("&Agrave;" , 'À' );
	str = str.replace("&Aacute;" , 'Á' );
	str = str.replace("&Acirc;" , 'Â' );
	str = str.replace("&Atilde;" , 'Ã' );  
	str = str.replace("&Ccedil;" , 'Ç' );
	str = str.replace("&Egrave;" , 'È' );
	str = str.replace("&Eacute;" , 'É' );
	str = str.replace("&Ecirc;" , 'Ê' );  
	str = str.replace("&Iacute;" , 'Í' );
	str = str.replace("&Oacute;" , 'Ó' );
	str = str.replace("&Ocirc;" , 'Ô' );
	str = str.replace("&Otilde;" , 'Õ' );  
	str = str.replace("&Uacute;" , 'Ú' );
	str = str.replace("&agrave;" , 'à' );
	str = str.replace("&aacute;" , 'á' );
	str = str.replace("&acirc;" , 'â' );  
	str = str.replace("&atilde;" , 'ã' );
	str = str.replace("&ccedil;" , 'ç' );
	str = str.replace("&egrave;" , 'è' );  
	str = str.replace("&eacute;" , 'é' );
	str = str.replace("&ecirc;" , 'ê' );
	str = str.replace("&iacute;" , 'í' );  
	str = str.replace("&oacute;" , 'ó' );
	str = str.replace("&ocirc;" , 'ô' ); 
	str = str.replace("&otilde;" , 'õ' );
	str = str.replace("&uacute; " , 'ú' ); 
}
  return str;
}
