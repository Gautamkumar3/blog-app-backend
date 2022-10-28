const accessFile = require("../access.json")
const jwt = require("jsonwebtoken")
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const WriterAutMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    let decoded = jwt.decode(token, secretKey);

    const role = accessFile.find((e) => e.role === decoded.role);

    if (role.access.post.includes("R") && role.access.post.includes("C") && role.access.post.includes("U") && role.access.post.includes("D")) {
        if (role.role === "Writer") {
            next()
        } else {
            return res.status(403).send("you are not allowed to create Post")
        }
    } else {
        return res.status(403).send("you are not allowed to create Post")
    }
}

module.exports = WriterAutMiddleware;