module.exports = () => {
    /**
     * Checks if a user is blacklisted
     *
     * @param {string} user_id
     * @returns {Promise<boolean | void>}
     */
    global.isBlacklistedUser = (user_id) => {
        return queryPromise('SELECT * FROM blacklisted_users WHERE user_id = ?', [
            user_id
        ]).then(results => {
            return results.length > 0
        }).catch(err => {
            console.error(err)
        })
    }
}