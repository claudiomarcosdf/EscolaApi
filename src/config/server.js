// const bodyParser = require('body-parser'); --> Obsoleto p/ versões do express acima de 14.16
const express = require('express');
const cors = require('cors');
const path = require('path');
const queryParser = require('express-query-int');

const server = express();
const PORT = process.env.PORT;

// server.use(bodyParser.urlencoded({ extended: true }));
// server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(
  cors({
    origin: process.env.CORS,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);
server.use(queryParser());

server.use(
  '/files',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
);

server.listen(PORT, function () {
  console.log(`BACKEND is running on port ${PORT}.`);
});

module.exports = server;
