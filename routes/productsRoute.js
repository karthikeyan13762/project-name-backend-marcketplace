const router = require("express").Router();

const Product = require("../models/productModel");

const authMiddleware = require("../middlewares/authMiggleware");

const cloudinary_js_config = require("../config/cloudinaryConfig");

const multer = require("multer");

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

// editproduct

router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  // go to the frontend product.js in apicalls
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete theproduct

router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
  // go to the frontend product.js in apicalls
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
}); // gotothe frontend

// handle image upload to the cloudinary
// get images from pc
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

router.post(
  "/upload-image-to-product",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      // upload image to the cloudinary
      const result = await cloudinary_js_config.uploader.upload(req.file.path, {
        folder: "marcketplace",
      });

      const productId = req.body.productId;

      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image upload successfully",
        result: {
          secure_url: result.secure_url, // This should match your frontend's expectations
        },
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete image from product and Cloudinary
router.post("/delete-image-from-product", authMiddleware, async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    // Delete the image from Cloudinary
    const publicId = imageUrl.split("/").slice(-1)[0].split(".")[0]; // Extract the public ID
    await cloudinary_js_config.uploader.destroy(`marcketplace/${publicId}`);

    // Remove the image URL from the product's images array
    await Product.findByIdAndUpdate(productId, {
      $pull: { images: imageUrl },
    });

    res.send({
      success: true,
      message: "Image deleted successfully",
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
