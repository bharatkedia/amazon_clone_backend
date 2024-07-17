const express = require("express");
const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwtToken = require("jsonwebtoken");
const auth = require("../middleware/auth");

const appRouter = express.Router();

// TODO: implement authetication system.
appRouter.post("/auth/signUp", async (req, res) => {
    try {
        console.log(req.body);
        let { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res
                .status(400)
                .json({
                    message: `User already exist with the email Id : ${email}`
                })
        }
        const hashPassword = await bcryptjs.hash(password, 8);
        
        let user = new User({
            name: name,
            email: email,
            password: hashPassword
        });
        user = await user.save();
        res.json(user);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

appRouter.post("/auth/signIn", async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ "message": `Username is not found : ${email}` });
        }

        let isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ "message": `Password is incorrect : ${password}` });
        }

        const token = jwtToken.sign({ id: user._id, email: user.email }, "secretKey");

        // "...user" will pop out all the attribute of the object (eg. {user: {a: b}} => {a:b})
        return res.status(200).json({ token, ...user._doc }); // {token: token, email:email, password:password}
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

appRouter.post("/isTokenValid", async (req, res) => {
    try {
        var token = req.headers('x-auth-token');
        if (!token) return res.json(false);

        var verified = jwtToken.verify(token, "secretKey");
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
});

// get user data
appRouter.get("/", auth, async (req, res) => {
    var user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({...user._doc, token: req.token});
});

module.exports = appRouter;
