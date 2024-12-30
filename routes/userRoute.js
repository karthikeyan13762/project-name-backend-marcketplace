// to write any end point 1st we need router

const router = require("express").Router();

// to per formoperations we need model

const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
// start writing the api

// new user registration

//  1 router.post (http method) ,2 end point is register, 3 allways callback function will async,4 always async block put try catch function
router.post("/register", async (req, res) => {
  try {
    // try block will block will be having 3 parts for user registration
    // 1 check user already exists with help of email
    const user = await User.findOne({ email: req.body.email });

    // Always try to send success true in try block if negarive senorios use throw new Error keyword

    if (user) {
      //   res.send({
      //     success: false,
      //     message: "User already exists",
      //   });
      // or
      throw new Error("User already exists"); //this is very simple it will going to the catch block
    }
    //2 user does not eixsts hashing the password
    // To hash the password 1st we need to generate the salt
    const salt = await bcrypt.genSalt(12); //these 12 willbe number of rounds

    const hashedPassword = await bcrypt.hash(req.body.password, salt); // 1st parrameter will be plain text thatyou want to encrypt, 2nd parameter will be salt object

    // 3 now attached the hashedPassword  to req.body.password
    req.body.password = hashedPassword;

    // 4 create a new user or else savenew user
    const newUser = new User(req.body);
    await newUser.save(); //In short, save() ensures that the document is validated, processed, and securely stored in the database.
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
