const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const queryParser = require('express-query-int');

const server = express();
const PORT = process.env.PORT;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(
  cors({
    origin: process.env.CORS,
  })
);
server.use(queryParser());

server.listen(PORT, function () {
  console.log(`BACKEND is running on port ${PORT}.`);
});

module.exports = server;
