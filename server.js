const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
// Load environment variables
dotenv.config();

const app = express();
const dbConfig = require("./config/config");
app.use(cors()); // This allows all origins by default
app.use(express.json()); // Middleware to parse JSON bodies
const port = process.env.PORT || 5000;

const usersRoute = require("./routes/userRoute");

const bidsRoute = require("./routes/bidRoute");
//1st importing product route and entry point
const productsRoute = require("./routes/productsRoute");
app.use("/api/products", productsRoute);

// this endpoints keyword '/api/users' will navigated to users route and check the login and registration endpoint based onthe endpoint nameit will exigute the logic and send the response weather it is ssuccess or error thisisthe process

// /api/users is a base route to group all user-related APIs (like registration and login) under a common path for better organization and clarity in the application's API structure.
app.use("/api/users", usersRoute);

app.use("/api/bids", bidsRoute);
// Start the server
app.listen(port, () => {
  console.log(`NodeJS/Express server started on port ${port}`);
});
