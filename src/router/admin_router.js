const express = require("express");
const admin = require("../middleware/admin.js");
const {Product} = require("../models/product.js");

const adminRouter = express.Router();

adminRouter.post("/admin/addProduct", admin, async (req, res) => {
  try {
    let { name, description, price, quantity, category, images } = req.body;
    let product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      images
    });
    product = await product.save();
    res.send(product);
  } catch (e) {
    console.log("router expection:", e);
    res.status(500).json({ error: e.message });
  }

});

adminRouter.get("/admin/getProducts", admin, async (req, res) => {
  try {
    let products = await Product.find({});
    res.send(products);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

adminRouter.delete("/admin/:productId", admin, async (req, res) => {
  try{
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.send("Product deleted successfully");
  } catch(e){
    console.log(e);
    res.status(500).json({error: e.message});
  }
});

module.exports = adminRouter;


