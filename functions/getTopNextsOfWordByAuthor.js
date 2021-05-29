module.exports = () => {
    global.getTopNextsOfWordByAuthor = (word, author_id) => {
        return queryPromise('SELECT word, COUNT(*) as use_count FROM words WHERE prev_id IN (SELECT id FROM words WHERE word = ?) AND author_id = ? GROUP BY word ORDER BY use_count DESC LIMIT 100', [
            word,
            author_id,
        ]).then(results => {
            return results
        }).catch(err => {
            console.error(err)
        })
    }
}