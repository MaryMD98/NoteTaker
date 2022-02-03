const express = require('express');

// import the modular routers for /notes
const notesRouter = require('./notes');

const app = express();

app.use('./notes', notesRouter);

module.exports = app;