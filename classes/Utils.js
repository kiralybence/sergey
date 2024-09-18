module.exports = class Utils {
    /**
     * Generate a random number
     *
     * @param min Inclusive
     * @param max Inclusive
     */
    static rand(min, max) {
        return Math.floor(Math.random() * (max + 1)) + min;
    }

    /**
     * Get a random element from an array
     *
     * @param arr
     */
    static randArr(arr) {
        if (arr.length === 0) {
            return null;
        }

        return arr[Utils.rand(0, arr.length - 1)];
    }
};