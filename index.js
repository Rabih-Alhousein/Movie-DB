const express = require("express")
const app = express()



const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب و الكباب', year: 1992, rating: 6.2 }
]


const users = [{
    username: 'rabi3',
    password: '12345678'
}, {
    username: 'ahmad',
    password: '12345678'
}, {
    username: 'houssein',
    password: '12345678'
}];


// ANCHOR Read Users Route
app.get("/users/get", (req, res) => {
    res.send({
        status: 200,
        data: users
    })
})
// ANCHOR Create User Route

//http://localhost:3000/users/add?username=rabi3&password=1999
app.post("/users/add", (req, res) => {
    let username = req.query.username
    let password = req.query.password
    if (username == undefined || password == undefined) {
        res.send({
            status: 403,
            error: true,
            message: 'you cannot create a user without providing a username and a a password'
        })
    } else if (users.some((a) => a.username == username)) {
        res.send({
            status: 403,
            error: true,
            message: 'username already exist, choose another one'
        })
    } else if (!(/^[a-z0-9_-]{3,15}$/).test(username)) {
        res.send({
            status: 403,
            error: true,
            message: ' username should be lowercase, do not start with a number and between 3 and 15 characters '
        })
    } else if (!(/^[A-Za-z0-9]\w{8,}$/).test(password)) {
        res.send({
            status: 403,
            error: true,
            message: ' password should start with letters or numbers only and should be 8 characters or more '
        })
    } else {
        users.push({ username, password })
        res.send({
            status: 200,
            data: users
        })
    }
})


// ANCHOR Delete User Route
//http://localhost:3000/users/delete/1

app.delete("/users/delete/:id", (req, res) => {
    const id = req.params.id
    if (id < 0 || (id > users.length - 1) || isNaN(id)) {
        res.send({
            status: 404,
            error: true,
            message: 'the user ' + id + ' does not exist'
        })
    } else {
        users.splice(id, 1)
        res.send({
            status: 200,
            data: users,
        })
    }
})

// ANCHOR Update User Route
// http://localhost:3000/users/edit/2?username=rabi3&password=1999

app.put("/users/edit/:id", (req, res) => {
    const id = req.params.id
    if (id < 0 || (id > users.length - 1) || isNaN(id)) {
        res.send({
            status: 404,
            error: true,
            message: 'the user ' + id + ' does not exist'
        })
    } else {
        let username = req.query.username
        let password = req.query.password
        if (username != undefined) {
            if (!(/^[a-z0-9_-]{3,15}$/).test(username)) {
                res.send({
                    status: 403,
                    error: true,
                    message: ' username should be lowercase, do not start with a number and between 3 and 15 characters '
                })
            } else {
                let exist = false
                for (let i = 0; i < users.length; i++) {
                    if (i == id) continue
                    if (users[i].username == username) {
                        exist = true
                        break
                    }
                }
                if (exist == true) {
                    res.send({
                        status: 403,
                        error: true,
                        message: 'you cannot use this username, it is already in use'
                    })
                } else {
                    if (password != undefined) {
                        console.log(password)
                        if (!(/^[A-Za-z0-9]\w{8,}$/).test(password)) {
                            res.send({
                                status: 403,
                                error: true,
                                message: ' password should start with letters or numbers only and should be 8 characters or more '
                            })
                        } else {
                            users[id].password = password
                        }
                    }

                    users[id].username = username
                    res.send({
                        status: 200,
                        data: users,
                    })
                }
            }
        }
    }


})


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
