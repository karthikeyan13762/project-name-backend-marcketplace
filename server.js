const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const dbConfig = require("./config/config");

const port = process.env.PORT || 3000;

const usersRoute = require("./routes/userRoute");

// this endpoints keyword '/api/users' will navigated to users route and check the login and registration endpoint based onthe endpoint nameit will exigute the logic and send the response weather it is ssuccess or error thisisthe process

app.use("/api/users", usersRoute);
// Start the server
app.listen(port, () => {
  console.log(`NodeJS/Express server started on port ${port}`);
});
