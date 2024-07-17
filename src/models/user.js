const mongoose = require("mongoose");
const { Product, productSchema } = require("../models/product");

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    email: {
        required: true,
        type: String,
        validate: {
            validator: (value) => {
                const re =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please enter valid email Id"
        }
    },
    password: {
        required: true,
        type: String
    },
    address: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "user"
    },
    cart: [{
        product: productSchema,
        quantity: Number
    }]


});
const User = mongoose.model("User", userSchema)
module.exports = User;

