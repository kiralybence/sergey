module.exports = () => {
    /**
     * Returns if a string is a tagged user
     *
     * @param {string} taggedUser
     * @returns {boolean}
     */
    global.isTaggedUser = (taggedUser) => {
        return taggedUser.startsWith('<@');
    };
};