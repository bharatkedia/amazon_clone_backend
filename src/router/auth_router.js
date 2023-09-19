const express = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');

const appRouter = express.Router();

// TODO: implement authetication system.
appRouter.post("/api/signUp", async (req, res) => {
    try {
        console.log(req.body);
        let { name, email, password } = req.body;
        const existUser = await User.findOne({email});
        if (existUser) {
            return res
            .status(400)
            .json({
                message: `User already exist with the email Id : ${email}`
            })
        }
        const hashPassword = await bcryptjs.hash(password, 8);
        let user = new User({
            name : name,
            email : email,
            password : hashPassword
        });
        user = await user.save();
        res.json(user);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
})

module.exports = appRouter;