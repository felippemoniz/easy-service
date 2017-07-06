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


app.use(cors());
app.use(bodyParser.json());



app.get('/filmesEmCartaz/:filtro', filmes.findAll);

app.get('/sessoesPorCinema/:id/:data', sessoes.findByTheater);

app.get('/filmesPorSessao/:id/:data', filmes.findFilmesPorSessao);

app.get('/cinemas/', cinemas.findAll);

app.get('/filmesEmCartaz/', filmes.findAll);

app.get('/topFilmes/', filmes.getTop6);

app.get('/sessoes/:id/:data', sessoes.findById);

app.get('/cinemasPorSessao/:id/:data', cinemas.findCinemaPorSessao);

app.get('/sessoesAgora/:data', sessoes.findNow);

app.get('/datasDisponiveis', datas.findAll);

app.get('/getDates/:data', sessoes.getDates);

app.get('/oi', function(req, res) {
  res.json({resposta: "Estou funcionando!"})
})


app.listen(config.port)
