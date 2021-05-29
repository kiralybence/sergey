module.exports = () => {
    global.getWordById = (id) => {
        return queryPromise('SELECT * FROM words WHERE id = ? LIMIT 1', [
            id,
        ]).then(results => {
            return results
                ? results[0]
                : null
        }).catch(err => {
            console.error(err)
        })
    }
}