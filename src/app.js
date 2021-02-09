const express = require('express');
const cors = require('cors');


const app = express();

app.use(
    cors({
        origin: '*',
        credentials: true,
        allowMethods: [ 'GET', ],
        allowedHeaders: [ 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    })
);

app.use('/', (req, res) => res.end());


module.exports = app;
