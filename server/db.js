const Pool = require('pg').Pool


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgre',
    port: 5432,
    database: 'todoapp'
})

module.exports = pool