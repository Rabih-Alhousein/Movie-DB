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



const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب و الكباب', year: 1992, rating: 6.2 }
]


// Search Route
app.get("/search/", (req, res) => {
    if (req.query.s) {
        res.send({
            status: 200,
            message: 'ok',
            data: req.query.s
        })
    } else {
        res.send({
            staus: 500,
            error: true,
            message: 'you have to provide a search'
        })
    }
})


// Create Route
app.get("/movies/add", (req, res) => {


})

// Read Route
app.get("/movies/get", (req, res) => {
    res.send({
        status: 200,
        data: movies
    })
})

// Update Route
app.get("/movies/edit", (req, res) => {

})

// Delete Route
app.get("/movies/delete", (req, res) => {

})



// Order by Date
app.get("/movies/read/by-date", (req, res) => {
    let SortedMovies = movies.slice().sort(function (a, b) { return b.year - a.year })
    res.send({
        status: 200,
        data: SortedMovies
    })


})
// Order by Rating
app.get("/movies/read/by-rating", (req, res) => {
    let SortedMovies = movies.slice().sort(function (a, b) { return b.rating - a.rating })
    res.send({
        status: 200,
        data: SortedMovies
    })


})
// Order by Title
app.get("/movies/read/by-title", (req, res) => {
    let SortedMovies = movies.slice().sort(function (a, b) { return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0) })
    res.send({
        status: 200,
        data: SortedMovies
    })

})


// Read One
app.get("/movies/read/id/:id", (req, res) => {
    /* the id may be a string but cannot be smaller than movies.length it must be a number */
    if (req.params.id >= '0' && req.params.id < movies.length) {
        res.send({
            status: 200,
            data: movies[req.params.id]
        })
    } else {
        res.status(404)
        res.send({
            status: 404,
            error: true,
            message: 'the movie ' + req.params.id + ' does not exist'
        })
    }
})






app.listen(3000)




