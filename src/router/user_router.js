const express = require("express");
const User = require("../models/user");
const {Product} = require("../models/product");
const auth = require("../middleware/auth");

const userRouter = express();

userRouter.put("/api/user/cartItems", auth, async (req, res) => { 
    try{
        let {id, quantity} = req.body;
        const product = await Product.findById(id);
        const user = await User.findById(req.userId);
        const cartProduct = user.cart.find(c => c.product._id.equals(product._id));
        if(product == null) {
            res.send(404).json({message: "Product not found. Id: " + id});
        }
        if(user.cart.length < 1){
            user.cart.push({
                product, quantity
            });
        }else if(cartProduct.quantity == 1 && quantity == -1){
            user.cart = user.cart.filter(c => !(c.product._id.equals(product._id)));
        }else{
            user.cart.filter((i) => i.product._id.equals(product._id)).map((i) => {
                i.quantity += quantity;
            });
        }
        await user.save();
        res.status(200).json({...user._doc, token : req.token});

    } catch (e){
        res.status(500).json({ error: e.message });
    }
});

module.exports = userRouter;