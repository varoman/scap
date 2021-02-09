const schedule = require('node-schedule');
const { scrap } = require('./scrap');


schedule.scheduleJob('0 32 13 * * *', () => {
    scrap();
});
