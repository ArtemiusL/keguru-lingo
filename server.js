const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.static(path.resolve(__dirname, 'build')));

// app.get('/', (req, res) => res.send('Hello World!'));

// app.use(express.static(__dirname + '/public'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
