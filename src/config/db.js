const mongoose = require("mongoose")
const Connect = () => {
    return mongoose.connect("mongodb+srv://gautam:gautam@cluster0.clfb7k7.mongodb.net/blogs")
}

module.exports = Connect;