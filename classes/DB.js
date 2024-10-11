import * as mysql from 'mysql2';

export default class DB {
    static connection;

    static init() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        this.query('set names utf8mb4');
        this.query(`set sql_mode=(select replace(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''))`);
    }

    static query(statement, params = null) {
        return new Promise((resolve, reject) => {
            this.connection.query(statement, params, (error, results) => {
                if (error) reject(error);
    
                resolve(results);
            });
        });
    }
}