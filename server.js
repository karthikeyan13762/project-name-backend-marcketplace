const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const dbConfig = require("./config/config");

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`NodeJS/Express server started on port ${port}`);
});
