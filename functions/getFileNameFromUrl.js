module.exports = () => {
    global.getFileNameFromUrl = (url) => {
        let result = new RegExp(/(?=\w+\.\w{3,4}$).+/).exec(url);

        return result?.[0];
    };
};