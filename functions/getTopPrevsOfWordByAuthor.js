const dayjs = require('dayjs')

module.exports = () => {
    global.getTopPrevsOfWordByAuthor = (word, author_id, days = null) => {
        const afterDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : null

        return queryPromise('SELECT prev_id, COUNT(*) as use_count FROM words WHERE word = ? AND author_id = ? ' + (days ? 'AND created_at >= ?' : '') + ' GROUP BY prev_id ORDER BY use_count DESC LIMIT 100', [
            word,
            author_id,
            afterDate,
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