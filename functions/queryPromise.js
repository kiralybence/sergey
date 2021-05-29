const mysql = require('mysql')

const dbh = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

dbh.query('SET NAMES utf8mb4')

module.exports = () => {
    global.queryPromise = (statement, params = null) => {
        return new Promise((resolve, reject) => {
            dbh.query(statement, params, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }
}