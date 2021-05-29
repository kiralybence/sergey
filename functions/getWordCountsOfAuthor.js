module.exports = () => {
    global.getWordCountsOfAuthor = (author_id, priorizeStartWords) => {
        return queryPromise('SELECT word, COUNT(*) as use_count FROM words WHERE author_id = ? GROUP BY word ORDER BY ' + (priorizeStartWords ? 'CASE WHEN prev_id IS NULL THEN 1 ELSE 0 END DESC,' : '') + ' use_count DESC LIMIT 100', [
            author_id,
        ]).then(results => {
            return results
        }).catch(err => {
            console.error(err)
        })
    }
}