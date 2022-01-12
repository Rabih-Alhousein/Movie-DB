const express = require("express")
const app = express()



const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب و الكباب', year: 1992, rating: 6.2 }
]


// ANCHOR MongoDB

var mongoose = require('mongoose')
mongoose.connect('mongodb+srv://rabih:1234@cluster0.wkivl.mongodb.net/mongodb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to mongodb'))
    .catch((err) => console.log(err))
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    rating: {
        type: Number,
        default: 4
    }
})


var Movies = mongoose.model('movies', MovieSchema);
//uploading the array of movies objects to mongodb for the first time
/* movies.map((row) => {
    console.log(row);
    var movie = new Movies(row);
    movie.save()
        .then((result) => console.log('movies uploaded to'))
        .catch((err) => console.log(err))
}); */



// ANCHOR Read Route
//http://localhost:3000/movies/read/

app.get("/movies/read", function (req, res) {
    Movies.find()
        .then((result) => res.send(result))
        .catch((err) => console.log(err))
})



// ANCHOR Order by Date Route
//http://localhost:3000/movies/read/by-date


app.get("/movies/read/by-date", (req, res) => {
    Movies.find()
        .then(moviesData => {
            res.send({ status: 200, data: moviesData.sort((a, b) => b.year - a.year) })
        }).catch(err => {
            console.log("error, no entry found")
        })
})


// ANCHOR Order by Rating Route
//http://localhost:3000/movies/read/by-rating


app.get("/movies/read/by-rating", (req, res) => {
    Movies.find()
        .then(moviesData => {
            res.send({
                status: 200, data: moviesData.sort((a, b) => b.rating - a.rating)
            })
        }).catch(err => {
            console.log("error, no entry found")
        })
});


// ANCHOR Order by Title Route
//http://localhost:3000/movies/read/by-title


app.get("/movies/read/by-title", (req, res) => {
    Movies.find()
        .then(moviesData => {
            res.send({
                status: 200, data: moviesData.sort((a, b) => (a.title).localeCompare(b.title))
            })
        }).catch(err => {
            console.log("error, no entry found")
        })
});

// ANCHOR Create Route
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
            let movie = new Movies({ title, year, rating })
            movie.save()
                .then(newMovie => {
                    Movies.find()
                        .then(moviesData => {
                            res.send({ status: 200, data: moviesData });
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

// ANCHOR Delete Route
//http://localhost:3000/movies/delete/61dcd26da7cefacd20d01394

app.delete("/movies/delete/:id", (req, res) => {
    const id = req.params.id
    Movies.findByIdAndDelete(id).then(deletedMovie => {
        Movies.find()
            .then(moviesData => {
                res.send({ status: 200, data: moviesData });
            }).catch(err => {
                console.log(err)
            })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${id}' does not exist ` });
    })
})

// ANCHOR Update Route
// http://localhost:3000/movies/edit/61dcd26da7cefacd20d01394?title=Jaws&year=1975&rating=8

app.put("/movies/edit/:id", (req, res) => {
    Movies.findById(req.params.id).then(async (doc, err) => {
        let title = req.query.title
        let year = req.query.year
        let rating = req.query.rating
        if (title != undefined) doc.title = title
        if (year != undefined && !isNaN(year) && year > 1900 && year <= 2022) doc.year = year
        if (rating != undefined && !isNaN(rating) && rating >= 0 && rating <= 10) doc.rating = rating
        await doc.save()
        Movies.find()
            .then(moviesData => {
                res.send({ status: 200, data: moviesData });
            }).catch(err => {
                console.log(err)
            })
            .catch((err) => console.log(err))

    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` })
    })

});
app.listen(3000)
