var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var filmes = require('./server/filmesEmCartaz-service')
var datas = require('./server/datasDisponiveis-service')
var sessoes = require('./server/sessoes-service')
var cinemas = require('./server/cinemas-service')
var datasDisponiveis = require('./server/datasDisponiveis-service')
var cors = require('cors')


app.use(cors());
app.use(bodyParser.json());



app.get('/filmesEmCartaz/:filtro', filmes.findAll);

app.get('/sessoesPorCinema/:id/:data', sessoes.findByTheater);

app.get('/cinemas/', cinemas.findAll);

app.get('/filmesEmCartaz/', filmes.findAll);

app.get('/topFilmes/', filmes.getTop6);

app.get('/sessoes/:id/:data', sessoes.findById);

app.get('/sessoesAgora/:data', sessoes.findNow);

app.get('/datasDisponiveis', datas.findAll);

//app.get('/getDates/:data', sessoes.getDates);





app.listen(8080)
