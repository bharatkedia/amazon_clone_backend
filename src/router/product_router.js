const express = require("express");
const auth = require("../middleware/auth");
const {Product} = require("../models/product");
const Rating = require("../models/rating");


const productRouter = express.Router();

productRouter.get("/api/products", auth, async (req, res) => {
  try {
    var products = await Product.findOne({});
    res.send(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Product By Category
productRouter.get("/api/product", auth, async (req, res) => {
  try {
    const category = req.query.category;
    const products = await Product.find({ category: category });
    res.send(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get Product By Search
productRouter.get("/api/product/search/:search", auth, async (req, res) => {
  try {
    const searchQuery = req.params.search;
    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
    });
    res.send(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.put("/api/product/rating", auth, async (req, res) => {
  try {
  
    var product = await Product.findById(req.body.id);
    
    const userRating = {
      userId: req.userId,
      rating: req.body.rating
    };
  
    product.rating = product.rating.filter((r) => r.userId !== userRating.userId);
    product.rating.push(userRating);

    product = await product.save();
    res.send(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/product/dealOfDay", auth, async(req, res) => {
  try{
      let productList = await Product.find({});
      let highestRating = 0;
      let product = null;
      let avgRating = 0;

      for(let i = 0; i < productList.length; i++){
        let ratingList = productList[i].rating;
        let sum = 0;
        ratingList.map((r) =>{
          sum = sum + r.rating;
        });
        if(sum != 0 ) avgRating = sum / ratingList.length;
        if(avgRating > highestRating){
          highestRating = avgRating;
          product = productList[i];
        }
      }
      res.send(product);
  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

module.exports = productRouter;
