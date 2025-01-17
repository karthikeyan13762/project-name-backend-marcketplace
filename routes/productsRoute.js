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

router.post("/get-products", async (req, res) => {
  try {
    const { seller, category = [], age = [], status } = req.body;

    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }
    // filterbycategory
    if (category.length > 0) {
      filters.category = { $in: category }; // Match products in selected categories
    }
    if (age.length > 0) {
      const ageConditions = age.map((item) => {
        const [fromAge, toAge] = item.split("-");
        return { $gte: Number(fromAge), $lte: Number(toAge) };
      });

      if (ageConditions.length === 1) {
        filters.age = ageConditions[0];
      } else {
        filters.age = { $or: ageConditions }; // Allow multiple age ranges
      }
    }
    const products = await Product.find(filters)
      .populate("seller", "name")
      .sort({ createdAt: -1 }); // later we will add the filters in the req body write now we are finding all

    res.send({
      success: true,
      data: products,
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

router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { status }); // Updates status field
    res.send({
      success: true,
      message: "Product status updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/get-product-by-id/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");

    res.send({
      success: true,
      data: product,
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
