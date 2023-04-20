const express = require('express');
const app = express()

const { cadastrarUsuario } = require('./controladores');
const rotas = require('./rotas')

app.use(express.json())

app.use(rotas)
app.listen(3000)