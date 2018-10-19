/* eslint-disable no-console */

'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { PORT } = require('./config');

const notesRouter = require('./routes/notes');
const foldersRouter = require('./routes/folders');
const tagsRouter = require('./routes/tags');

// Create an Express application
const app = express();

// Log all requests
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Create a static webserver
app.use(express.static('public'));

// Enable CORS support
app.use(cors());

// Parse request body
app.use(express.json());

// Mount routers on "/api"
app.use('/api/notes', notesRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

if (require.main === module) {
  // Listen for incoming connections
  app
    .listen(PORT, function serverListen() {
      console.info(`Server listening on ${this.address().port}`);
    })
    .on('error', (err) => {
      console.error(err);
    });
}

module.exports = app;
