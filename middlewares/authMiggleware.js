const jwt = require("jsonwebtoken");
// In the authMiddleware.js weare going to exigute middleware logic for every protected endpoint

// 1st  to get the token we need to accessthe request body

module.exports = (req, res, next) => {
  // next method is nothing but the logic which will have in the try block

  try {
    //  get the token from the header -> frontend axiosInstance in the frontend wear passingthe authorization like barrer followed by the actual token we have split this authorization and take the one index

    const token = req.header("Authorization").split(" ")[1];

    // after getting the token you haveto decriptthe

    const decyptedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    //To create the encripted you have to use jwt.sign() method
    // To create the decripted you have to use the jwt.verify() method
    //verify() 1st parametre token 2nd parametre secretkey this secret key mustmatch with the secreat key you used in encription

    // now you have to atached the userid to the request body
    req.body.userId = decyptedToken.userid;
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// import this
