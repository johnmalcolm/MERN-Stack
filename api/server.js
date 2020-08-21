const express = require('express');
require('dotenv').config();
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
const port = process.env.API_SERVER_PORT;

// Setup Express Server
const app = express();

installHandler(app);

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR', err);
  }
}());
