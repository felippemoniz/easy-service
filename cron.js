var parser = require('xml2json');
var got = require('got');
var mongoose = require('mongoose')

String.prototype.replaceAll = function(de, para){
    var str = this;
    var pos = str.indexOf(de);
    while (pos > -1){
    str = str.replace(de, para);
    pos = str.indexOf(de);
  }
    return (str);
}


got("http://www.cinemark.com.br/programacao.xml")
    .then(response => {
//       var json = parser.toJson(response.body);
       mongoose.connect('mongodb://localhost/easymoviedb');
       var db = mongoose.connection;
       db.on('error', console.error.bind(console, 'connection error:'));
       db.once('open', function() {
         var Schema = mongoose.Schema;
         var thingSchema = new Schema({}, { strict: false });
         // TODO resolver má formatação do JSON
         //var objeto = JSON.parse(json.replaceAll("$t","valor"));
         var Cinema = mongoose.model('Cinema', thingSchema);
//         var data = objeto.cinemark.regioes;
//         console.log(data);
         //var cinema = new Cinema(objeto);
//         cinema.save();
         //var thing = new Coisa({objeto});
         //thing.save();
/*
         Cinema.find({}).exec(function(err,data){
            console.log(data); 
         });*/

          // TODO estudar como fazer queries

         Cinema.find({"cinemark.regioes.regiao.id":"4"}).exec(function(err,data){
            console.log(data[0]); 
         });

         console.log('salvou!!');
       });

    })
    .catch(error => {
        console.log(error.response.body);
    });

/*
got("http://www.cinemark.com.br/programacao.xml")
    .then(response => {
//       var json = parser.toJson(response.body);
       mongoose.connect('mongodb://localhost/easymoviedb');
       var db = mongoose.connection;
       db.on('error', console.error.bind(console, 'connection error:'));
       db.once('open', function() {
         var Schema = mongoose.Schema;
         var thingSchema = new Schema({}, { strict: false });
         // TODO resolver má formatação do JSON
         //var objeto = JSON.parse(json.replaceAll("$t","valor"));
         var Cinema = mongoose.model('Cinema', thingSchema);
//         var data = objeto.cinemark.regioes;
//         console.log(data);
         //var cinema = new Cinema(objeto);
//         cinema.save();
         //var thing = new Coisa({objeto});
         //thing.save();

         var resultado = Cinema.find({cinemark: {regioes:{}}});
         console.log(resultado);

         console.log('salvou!!');
       });

    })
    .catch(error => {
        console.log(error.response.body);
    });

*/