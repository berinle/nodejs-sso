const btoa = require('btoa');
const request = require('request-promise');
var path = __dirname + '/views/';
// const authMiddleware = require('./auth');
const { buildAuthUrl, validate } = require('./auth');

const express = require('express');
const cfenv = require('cfenv');
const router = express.Router();

const bodyParser = require('body-parser');

const app = express();
const appEnv = cfenv.getAppEnv();
const port = appEnv.port || 3000;
const { SCOPE } = process.env;

app.use(bodyParser.json());
// app.use(validate);

app.get('/', async (req, res) => { 
    console.log(`here...`);
    res.sendFile(path + 'index.html'); 
});

app.get('/protected', (req, res) =>  res.send('**** PROTECTED ****')); 

app.post('/v1/login', async (req, res) => {
    return res.status(200).end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))