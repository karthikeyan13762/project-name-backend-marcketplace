const mongoose = require("mongoose");

require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);

const connections = mongoose.connection;

connections.on("connected", () => {
  console.log("MongoDB Connected Successfully");
});

// Also handle negative

connections.on("error", (err) => {
  console.log("MongoDB Connection Failed");
});

module.exports = connections; // import this file in server.js   -> const dbConfig = require("./config/config.js");
