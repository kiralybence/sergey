const dayjs = require('dayjs')

module.exports = () => {
    global.getTopNextsOfWordByAuthor = (word, author_id, days = null) => {
        const afterDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : null

        return queryPromise('SELECT word, COUNT(*) as use_count FROM words WHERE prev_id IN (SELECT id FROM words WHERE word = ?) AND author_id = ? ' + (days ? 'AND created_at >= ?' : '') + ' GROUP BY word ORDER BY use_count DESC LIMIT 100', [
            word,
            author_id,
            afterDate,
        ]).then(results => {
            return results
        }).catch(err => {
            console.error(err)
        })
    }
}