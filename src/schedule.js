const schedule = require('node-schedule');
const { scrap } = require('./scrap');


module.exports.setScheduledJob = () => schedule.scheduleJob('0 35 15 * * *', () => {
    scrap();
});
