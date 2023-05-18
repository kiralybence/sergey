module.exports = () => {
    /**
     * Returns the user ID of a tagged user
     *
     * @param {string} user Tagged user
     * @returns {string|null} The tagged user's ID
     */
    global.getIdOfTaggedUser = (user) => {
        if (!isTaggedUser(user)) {
            return null;
        }

        return user
            .replace('<@!', '')
            .replace('<@', '')
            .replace('>', '');
    };
};