const express = require('express');
const app = express();
const api = require('./routes/api');
const body_parser = require('body-parser');

app.use(body_parser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', api);

app.listen(3000);
