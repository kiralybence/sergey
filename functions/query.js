const mysql = require('mysql2');

const dbh = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

dbh.query('set names utf8mb4');

global.query = (statement, params = null) => {
    return new Promise((resolve, reject) => {
        dbh.query(statement, params, (error, results) => {
            if (error) reject(error);

            resolve(results);
        });
    });
};