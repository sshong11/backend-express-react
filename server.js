require("dotenv").config()
const {PORT = 3000, MONGODB_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors") // cors headers
const morgan = require("morgan") // logging

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disonnected to Mongo"))
.on("error", (error) => console.log(error))

/////////////////////////////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)
/////////////////////////////////////////////////////////

app.use(cors()) // prevent cors errors
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies

// ROUTES//
// test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// index
app.get("/people", async (req, res) => {
    try {
        // send all the peoples
        res.json(await People.find({}))
    } catch (error) {
        // send error
        res.status(400).json({error})
    }
})

// create
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json({error})
    }
})

// update
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json({error})
    }
})

// delete
app.delete("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

/////////////
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})