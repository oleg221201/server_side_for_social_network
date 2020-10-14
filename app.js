const express = require("express")
const config = require("config")
const mongoose = require("mongoose")
const app = express();

app.use(express.json({extended: true}))

app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/post", require("./routes/post.routes"))
app.use("/api/comment", require('./routes/comment.routes'))

start()

async function start () {
    try{
        await mongoose.connect(config.get("mongoDb"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        app.listen(config.get("PORT"), ()=>{console.log("Server started...")})
    } catch (err) {
        console.log("Server error", err.message)
        process.exit(1)
    }
}