const express = require("express")
const http = require("http");
const { Server } = require("socket.io")
const cors = require("cors");
const Connect = require("./config/db");
require('dotenv').config();
const PORT = process.env.PORT || 8000;
const userRouter = require("./user/user.router")
const postRouter = require("./post/post.router")
const commentRouter = require("./comment/comment.router")


const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comments", commentRouter)

app.get("/", (req, res) => {
    res.send("Welcome to apna blog")
})


server.listen(PORT, async () => {
    await Connect()
    console.log(`Server is running on port ${PORT}`)
})