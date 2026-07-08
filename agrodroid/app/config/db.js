const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;


//const { Pool } = require("pg");

//console.log({
//  DB_HOST: process.env.DB_HOST,
//  DB_PORT: process.env.DB_PORT,
//  DB_USER: process.env.DB_USER,
//  DB_PASSWORD: process.env.DB_PASSWORD,
//  DB_NAME: process.env.DB_NAME,
//});

//const pool = new Pool({
//  user: process.env.DB_USER,
//  host: process.env.DB_HOST,
//  database: process.env.DB_NAME,
//  password: process.env.DB_PASSWORD,
//  port: process.env.DB_PORT,
//});

//module.exports = pool;