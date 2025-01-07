// to write any end point 1st we need router

const router = require("express").Router();

// to per formoperations we need model

const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken"); //This is encrypting the data and getting token and send token to the frontend
const authMiggleware = require("../middlewares/authMiggleware");

// JWT (JSON Web Token) is a compact and secure method for transmitting information between parties as a JSON object, typically used for authentication and authorization in web applications.

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
    res.send({
      success: true,
      message: "User Register  successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// ------------------------------------------------------------------

// user login , even this login there will be three steps

router.post("/login", async (req, res) => {
  try {
    // 1 check waetherthe user is exist or not if user does not exists throw response like user does not exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User not found");
    }
    // out of the if statement means user exist
    // 2 compare the hashed password  and plain pasword if that is success then send success response to the client
    // we are having the method compare method in bcrypt itwill take both plain and hashed password

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    ); // 1st parameter will be the plain password,2nd password will be the hashed password (hashed password inthe sens enrypted password which is will be stotedin the mongoDB  )

    //  if validPassword is true we are going to sed the response as login succesfull else invalid password

    if (!validPassword) {
      throw new Error("Invalid Password");
    }
    // else send the response

    // 3 after comparing the password you have generating the token(create and asign the token) we are going to encrypt just userID (encrypted user id will beinthe form of token)not complete user object that token we will send it to the frontend  as the login response

    const token = jwt.sign({ userid: user._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1hr",
    }); //The method to be encrypt is sign 1st parameter will be the data that you want to encrypt ,2nd parameter will be the secret key becaus while decrypting you need key to decrept

    // we are going to send the data as token
    // in the registration we arenotsending any data to the client we are sending the flag weather itis success or false becaus don'trequireany data after compleationg the registration but after loging we need some data from the server  which is nothing but the token ,becasus after the loginuser will navigated to the homepage , homepage they will perfom one more request like get all products -> get all products only exiguted-> once login you need token to perform otherapi request
    res.send({
      success: true,
      message: "User logedin successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
// ------------------------------------------------------
//get current user-> that means get the information of the loged in user-> fromthefrontend what will we except only token that menas which will send while the login ,when there login we  will send the JWT token->these tken havethe encripted form of the user ID

//frontend is calling the get currect userapi we will except the token becaus frontend not even no the userID of loged in person, frontend knomw token,help ofthe token we havet validate the regingapis
router.get("/get-current-user", authMiggleware, async (req, res) => {
  // req.body we will not having anything only req.headers wewill havw authorization token,we haveto decriptthe token and then token is valid then only you have send the response , but wedon't know how many apis we are going have with protected route concept ,thatis the reson we have to write this token decription logic in the somewher else we can re use thatpartis called middleware ,thatmeans before exiguting any protected endpoint logic we have to check the middleware , what logic checkinthe middelawre we haveto checkthe token -> the tokenis valid thenonly exigute this logic  res.send({  success: true,message: "User feteched successfully",data: user,}); Thts the condition oftheprotected route only loged in users canbe se the contenet of the home page that mens we will calthe homepageis /get-current-user
  //frontend we will call it as the protected route inback end we will call  it us the authorization both  are same concepts
  // un authorize user cannot be able to use our application

  try {
    // fetch the useerId from the mongodb and send the details to the UI

    const user = await User.findById(req.body.userId); //we don't have userid write now,sotoget the  userid you must called the uthmiddleware
    console.log(user);

    res.send({
      success: true,
      message: "User feteched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
// ------------------------------------------------------

// now we haveregistration and login  let me export both

module.exports = router; // go to the server.js // this endpoints keyword '/api/users' will navigated to users route and check the login and registration endpoint based onthe endpoint nameit will exigute the logic and send the response weather it is ssuccess or error thisisthe process -> app.use("/api/users", usersRoute);
