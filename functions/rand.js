module.exports = () => {
    /**
     * Generate a random number
     *
     * @param min Inclusive
     * @param max Inclusive
     */
    global.rand = (min, max) => {
        return Math.floor(Math.random() * (max + 1)) + min
    }
}