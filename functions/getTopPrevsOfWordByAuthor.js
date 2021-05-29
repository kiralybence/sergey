module.exports = () => {
    global.getTopPrevsOfWordByAuthor = (word, author_id) => {
        return queryPromise('SELECT prev_id, COUNT(*) as use_count FROM words WHERE word = ? AND author_id = ? GROUP BY prev_id ORDER BY use_count DESC LIMIT 100', [
            word,
            author_id,
        ]).then(results => {
            // Attach the actual words
            return results.map(result => {
                result.word = getWordById(result.prev_id)
                return result
            })
        }).catch(err => {
            console.error(err)
        })
    }
}