const express = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwtToken = require("jsonwebtoken");

const appRouter = express.Router();

// TODO: implement authetication system.
appRouter.post("/auth/signUp", async (req, res) => {
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
});

appRouter.post("/auth/signIn",async (req, res) => {
    try{
        let {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({"message":`Username is not found : ${email}`});
        }

        let isMatch = await bcryptjs.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({"message":`Password is incorrect : ${password}`});
        }

        const token = jwtToken.sign({id: user._id, email: user.email}, "secretKey");

    // "...user" will pop out all the attribute of the object (eg. {user: {a: b}} => {a:b})
        return res.status(200).json({token, ...user._doc}); // {token: token, email:email, password:password}
    }catch (e){
        return res.status(500).json({error: e.message});
    }
});

module.exports = appRouter;