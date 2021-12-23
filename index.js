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
    res.send({
        status: 200,
        message: date.getHours() + ":" + date.getMinutes()
    });
})

// Hello  Route
app.get("/hello/:id", (req, res) => {
    res.send({
        status: 200,
        message: 'Hello ' + req.params.id + '!'
    })
})


app.get("/hello/", (req, res) => {
    res.send({
        status: 200,
        message: 'Hello'
    })
})


// Search Route
app.get("/search/", (req, res) => {
    if (req.query.s) {
        res.send({
            status: 200,
            message: 'ok',
            data: req.query.s
        })
    } else{
        res.send({
            staus: 500,
            error: true,
            message: 'you have to provide a search'
        })
    }
})





app.listen(3000)




