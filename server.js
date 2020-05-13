const express = require('express');

const postRouter = require('./postRouter.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send(`
        <h2>Post Api</h>
      `);
  });

  module.exports = server;