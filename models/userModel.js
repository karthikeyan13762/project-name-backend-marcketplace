const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  //The new keyword is used to create a new schema object for defining the structure of documents in the database.
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //This timestamp provides the date and time when the document was created and last updated.
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User; // we can export this model , so we can do all crud operations with the help of this model using the mongoose
