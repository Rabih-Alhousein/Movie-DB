const express = require("express")
const app = express()

// Home Route
app.get("/", (req, res) => {
    res.status(200).send("ok")
})

// Test Route

app.get("/test", (req, res) => {
    res.send({
        status: 200,
        message: "ok"
    });
})


// Time Route
app.get('/time', (req, res) => {
    var date = new Date()
    res.send ({
        status: 200,
        message: date.getHours() + ":" + date.getMinutes()
    });
})


app.listen(3000)




