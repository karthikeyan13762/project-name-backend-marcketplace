const router = require("express").Router();

const Product = require("../models/productModel");

const authMiddleware = require("../middlewares/authMiggleware");

// 1st endpoint add new product

// nothing to do backend just get the data and save it to the mongoDB

router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({
      success: true,
      message: "Prodect created successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Once you add the product you need to fetch the product by the id

// get all the products

router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find(); // later we will add the filters in the req body write now we are finding all

    res.send({
      success: true,
      message: products,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

//  go to the server.js and import  const productsRoute = require("./routes/productsRoute"); app.use("/api/products", productsRoute);
