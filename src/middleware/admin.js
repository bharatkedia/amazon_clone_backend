const jwtToken = require("jsonwebtoken");
const user = require("../models/user");


const admin = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token)
      return res.status(401).json({ message: "No auth token. Access Denied." });
    const verified = jwtToken.verify(token, "secretKey");
    if (!verified)
      return res.status(401).json({ message: "Token verification failed. authorization denied." });
    const loginUser = await user.findById(verified.id);
    if (!loginUser)
      return res.status(404).json({ message: "User not found" });

    if (loginUser.type != 'admin') {
      return res.status(401).json({ message: "User must be an admin" });
    }

    next();
  } catch (e) {
    console.log("middle expection:", e);
    return res.status(500).json({ error: e.message })
  }

}

module.exports = admin;
