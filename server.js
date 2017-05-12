var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var filmes = require('./server/filmesEmCartaz-service')
var datas = require('./server/datasDisponiveis-service')
var sessoes = require('./server/sessoes-service')
var datasDisponiveis = require('./server/datasDisponiveis-service')
var cors = require('cors')


app.use(cors());
app.use(bodyParser.json());



app.get('/filmesEmCartaz/:filtro', filmes.findAll);

app.get('/filmesEmCartaz/', filmes.findAll);

app.get('/sessoes/:id/:data/:preferencia', sessoes.findById);

app.get('/sessoesAgora/', sessoes.findNow);

app.get('/datasDisponiveis', datas.findAll);



app.listen(8080)


