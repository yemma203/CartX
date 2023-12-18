const express = require('express');
const cors = require('cors');
const app = express();
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');


require('dotenv').config();

const pool = mariadb.createPool({
    user: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 100,
});

app.use(cors());
app.use(express.json());
