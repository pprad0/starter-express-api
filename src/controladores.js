const knex = require('./conexao')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = 'syntaxerror'

//cadastro
const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json('A informação do nome, email e senha são parametros obrigatórios !')
    }

    try {
        const existeEmail = await knex('usuarios').where({ email }).first()

        if (existeEmail) {
            return res.status(400).json('Email já cadastrado !')
        }

        const senhAcrip = await bcrypt.hash(senha, 10)

        const usuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhAcrip
        })

        return res.status(201).send()

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }
}

const listarCategorias = async (req, res) => {
    try {
        const categoriaListar = await knex('categorias').returning('*')
        return res.status(200).json(categoriaListar)

    } catch (error) {

        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }
}


const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json('É obrigatória a informação de e-mail e senha !')
    }

    try {
        const usuario = await knex('usuarios').where({ email }).first()

        if (!usuario) {
            return res.status(404).json('Usuario não encontrado !')
        }

        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(400).json('Email e/ou senha incorretos !')
        }

        const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '8h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json('Erro interno do servidor !')
    }

}

const autenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json({ mensagem: 'Não autorizado !' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, senhaHash)

        const userExistente = await knex('usuarios').where({ id }).first()

        if (!userExistente) {
            return res.status(404).json({ mensagem: 'Não autorizado !' })
        }

        const { senha: _, ...usuario } = userExistente

        req.usuario = usuario
        next()

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })

        // return res.status(500).json({ mensagem: error.message })

    }
}


const detalharUsuario = async (req, res) => {
    res.status(200).json({ usuário: req.usuario })
}


module.exports = {
    cadastrarUsuario,
    listarCategorias,
    login,
    autenticacao,
    detalharUsuario
}