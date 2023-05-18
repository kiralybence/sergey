module.exports = () => {
    global.removeAccents = (str) => {
        return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    };
};