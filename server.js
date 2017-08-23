var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var filmes = require('./server/filmesEmCartaz-service')
var datas = require('./server/datasDisponiveis-service')
var sessoes = require('./server/sessoes-service')
var cinemas = require('./server/cinemas-service')
var datasDisponiveis = require('./server/datasDisponiveis-service')
var cors = require('cors')
var config = require('./server/config')
var carga = require('./server/carga')


app.use(cors());
app.use(bodyParser.json());



app.get('/filmesEmCartaz/:filtro', filmes.findAll);

app.get('/sessoesPorCinema/:id/:data', sessoes.findByTheater);

app.get('/sessoesHojePorCinema/:id/:data/:hora', sessoes.findByTheaterToday);

app.get('/filmesPorSessao/:id/:data', filmes.findFilmesPorSessao);

app.get('/cinemas/', cinemas.findAll);

app.get('/filmesEmCartaz/', filmes.findAll);

app.get('/topFilmes/', filmes.getTop6);

app.get('/sessoes/:id/:data', sessoes.findById);

app.get('/sessoesHoje/:id/:data/:hora', sessoes.findByIdToday);

app.get('/cinemasPorSessao/:id/:data', cinemas.findCinemaPorSessao);

app.get('/sessoesAgora/:data', sessoes.findNow);

app.get('/datasDisponiveis', datas.findAll);

app.get('/getDates/:data', sessoes.getDates);

app.get('/oi', function(req, res) {
  res.json({resposta: "Estou funcionando!"})
})

//ROTINAS DE CARGA

app.get('/apagaTabelas/:idtabela', carga.truncateTable);
app.get('/incluirCinema/:idcidade', carga.incluirCinema);
app.get('/incluirFilmes/:idcidade', carga.incluirFilmes);
app.get('/terminaConexao', carga.terminaConexao);

app.listen(config.port)
console.log("O BD está na porta:" + config.port);
