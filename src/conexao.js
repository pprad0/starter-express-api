require('dotenv').config();

const knex = require('knex')({

    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '123456',
        database: 'pdv',
    },
});

module.exports = knex