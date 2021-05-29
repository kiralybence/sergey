const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = () => {
    global.formatTimestamp = (timestamp) => {
        return dayjs(timestamp)
            .tz(process.env.TIMEZONE)
            .format('YYYY-MM-DD HH:mm:ss')
    }
}