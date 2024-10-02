const mysql = require('mysql2');

module.exports = class DB {
    static connection = null;

    static init() {
        DB.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        DB.query('set names utf8mb4');
        DB.query(`set sql_mode=(select replace(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);
    }

    static query(statement, params = null) {
        return new Promise((resolve, reject) => {
            DB.connection.query(statement, params, (error, results) => {
                if (error) reject(error);
    
                resolve(results);
            });
        });
    }
};