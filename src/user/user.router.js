const express = require("express")
const jwt = require("jsonwebtoken");
const UserModel = require("./user.schema");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY
const refreshKey = process.env.REFRESH_KEY;
const Authmiddleware = require("../middleware/Authentication")


const app = express.Router()

app.get("/", Authmiddleware, (req, res) => {
    res.send("Welcome to user page")
})

app.post("/signup", async (req, res) => {
    let { name, email, password, role } = req.body;
    let user = await UserModel.findOne({ email })
    try {
        if (user) {
            return res.status(400).send("This email is already in use try another email")
        }
        let newUser = new UserModel({ name, email, password, role })
        await newUser.save();
        return res.status(200).send(newUser)
    } catch (er) {
        return res.status(500).send(er.message)
    }
})

app.post("/refresh", async (req, res) => {
    const refreshtoken = req.headers.authorization;
    if (refreshtoken) {
        try {
            jwt.verify(refreshtoken, refreshKey, (er, data) => {
                if (er) {
                    return res.status(406).send("User not authorized")
                } else {
                    const maintoken = jwt.sign({ id: data.id, email: data.email, name: data.name, role: data.role }, secretKey, { expiresIn: "1 day" })
                    return res.status(200).send({ token: maintoken })
                }
            });
        } catch (er) {
            return res.status(403).send({ msg: er.message })
        }
    } else {
        return res.status(406).send("User not authorized")
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password })
    if (!user) {
        return res.status(404).send("Invalid Credentials")
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, secretKey, { expiresIn: "1 day" })

    const refreshToken = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, refreshKey, { expiresIn: "7 days" })

    res.status(200).send({ msg: "Login successfull", token: token, rtoken: refreshToken, name: user.name, id: user._id })
})



module.exports = app;