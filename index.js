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




// Read Route
app.get("/movies/get", (req, res) => {
    res.send({
        status: 200,
        data: movies
    })
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


// Read One Route
app.get("/movies/read/:id", (req, res) => {
    if (req.params.id >= 0 && req.params.id < movies.length) {
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

//  Create Route

//http://localhost:3000/movies/add?title=movie&year=1999&rating=9
app.post("/movies/add", (req, res) => {
    let title = req.query.title
    let year = req.query.year
    let rating = req.query.rating
    if (title == undefined || year == undefined) {
        res.send({
            status: 403,
            error: true,
            message: 'you cannot create a movie without providing a title and a year'
        })
    } else {
        if (rating == undefined || isNaN(rating) || rating < 0 || rating > 10) rating = 4
        if (isNaN(year) || year.length != 4 || year > 2022 || year < 1900) {
            res.send({
                status: 403,
                error: true,
                message: 'please enter a valid year'
            })
        } else {
            year = parseInt(year)
            rating = parseFloat(rating)
            movies.push({ title, year, rating })
            res.send({
                status: 200,
                data: movies
            })
        }
    }
})



// Delete Route
app.delete("/movies/delete/:id", (req, res) => {
    const id = req.params.id
    if (id < 0 || (id > movies.length - 1) || isNaN(id)) {
        res.send({
            status: 404,
            error: true,
            message: 'the movie ' + id + ' does not exist'
        })
    } else {
        movies.splice(id, 1)
        res.send({
            status: 200,
            data: movies,
        })
    }
})

// Update Route
// http://localhost:3000/movies/edit/2?title=Deadpool&year=2016&rating=8
app.put("/movies/edit/:id", (req, res) => {
    const id = req.params.id
    if (id < 0 || (id > movies.length - 1) || isNaN(id)) {
        res.send({
            status: 404,
            error: true,
            message: 'the movie ' + id + ' does not exist'
        })
    } else {
        let title = req.query.title
        let year = req.query.year
        let rating = req.query.rating
        if (title != undefined) movies[id].title = title
        if (year != undefined && !isNaN(year) && year > 1900 && year <= 2022) movies[id].year = year
        if (rating != undefined && !isNaN(rating) && rating >= 0 && rating <= 10) movies[id].rating = rating
        res.send({
            status: 200,
            data: movies,
        })

    }
})

app.listen(3000)
