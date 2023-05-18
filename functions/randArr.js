module.exports = () => {
    /**
     * Get a random element from an array
     *
     * @param arr
     */
    global.randArr = (arr) => {
        if (arr.length === 0) {
            return null;
        }

        return arr[rand(0, arr.length - 1)];
    };
};