const dayjs = require('dayjs')

module.exports = () => {
    global.getWordCountsOfAuthor = (author_id, priorizeStartWords, days = null) => {
        const afterDate = days
            ? dayjs()
                .subtract(days, 'days')
                .tz(process.env.TIMEZONE)
                .format('YYYY-MM-DD HH:mm:ss')
            : null

        return queryPromise('SELECT word, COUNT(*) as use_count FROM words WHERE author_id = ? ' + (days ? 'AND created_at >= ?' : '') + ' GROUP BY word ORDER BY ' + (priorizeStartWords ? 'CASE WHEN prev_id IS NULL THEN 1 ELSE 0 END DESC,' : '') + ' use_count DESC LIMIT 100', [
            author_id,
            afterDate,
        ]).then(results => {
            return results
        }).catch(err => {
            console.error(err)
        })
    }
}