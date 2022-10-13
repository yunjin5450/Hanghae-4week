const express = require("express")
//const authMiddleware = require("./middlewares/auth-middleware")
//const mongoose = require("mongoose")
const postsRouter=require("./routes/posts.js")
const commentRouter =require("./routes/comments.js")
const userRouter =require("./routes/user.js")

const app =express()
const port =3000
app.use(express.json())

app.use("/api",[postsRouter, commentRouter, userRouter])

// mongoose.connect("mongodb://localhost/yunjin2", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// const db = mongoose.connection
// db.on("error", console.error.bind(console, "connection error:"))



//app.use(express.static("assets"))
app.get('/', (req,res)=>{res.send("열려용?")})

app.listen(port, () => {
    console.log(port," 포트로 서버가 켜짐~")
})

