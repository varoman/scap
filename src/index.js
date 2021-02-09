const http = require('http');
const app  = require('./app');
const { setScheduledJob } = require('./schedule');


const startServer = () => {
    const port = process.env.PORT || '5000';
    http.createServer(app).listen(port);
}

const bootStrapApp = () => {
    startServer();
    setScheduledJob();
}


bootStrapApp();


