const express = require('express');
const controlador = require('./controladores');
const rotas = express();


rotas.post('/usuario', controlador.cadastrarUsuario)
rotas.get('/categorias', controlador.listarCategorias)
rotas.post('/login', controlador.login)

rotas.use(controlador.autenticacao)

rotas.get('/usuario', controlador.detalharUsuario)


module.exports = rotas;