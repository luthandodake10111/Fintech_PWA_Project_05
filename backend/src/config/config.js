import mysql from 'mysql2/promise'  //promises for async and await functions
import {config} from 'dotenv'


config()


const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

export {pool}