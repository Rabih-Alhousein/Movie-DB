const express = require("express")
const app= express()

//Create the home route
app.get("/", (req,res) => {
    res.status(200).send("ok")
})

app.listen(3000)