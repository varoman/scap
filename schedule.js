const schedule = require('node-schedule');
const { scrap } = require('./scrap');


schedule.scheduleJob('0 10 8 * * *', () => {
    scrap();
});
