const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const authController = require('../controllers/auth');
const util = require('util');



const con = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONNUM
});


con.getConnection((err) => {
    if (err) throw err;
    else console.log('connected');
});

const query = util.promisify(con.query).bind(con);


//This is the movie controller middleware for home.  We query the database for the default movies, send the results one after another to the API and put all the results in an array which we send over the movies.ejs page for rendering. this middleware is called through the route in the auth.js file.
exports.home = async(req, res, next) => {
    //Getting the default movies from the DB.
    const result = await query('select * from defaultmovies order by rand() limit 10'); {
        let movielist = [];

        for (let i = 0; i < result.length; i++) {
            let id = result[i].MovieID;
            //Getting the movie data via the API per movie ID.
            let movieAPI = await axios.get(`https://omdbapi.com/?apikey=24998e29&I=${id}&type=movie`)

            try {
                if (req.user.Userid) {
                    //If this is a registered user, we check if movies from the list are in his favorites, if yes, a value of 1 is passed in userfav, if not, a 0 is passed.
                    const result = await query(`select * from favorites where MovieID = \'${id}\' and Userid = ?`, [req.user.Userid]);


                    if (result.length == 1) {
                        movieAPI.data.userfav = '1'
                        movielist.push(movieAPI.data)
                    } else {
                        movieAPI.data.userfav = '0'
                        movielist.push(movieAPI.data)
                    }
                }
            } catch (err) {

                movielist.push(movieAPI.data)
            }

        }
        //send the list to the page for rendering.
        res.render('movies', { movies: movielist, user: req.user })

    }
};

//This is the movie controller middleware for the single movie page.  When a user clicks on a movie poster, a new page opens up with the movies data. this middleware is called through the route in the auth.js file.
exports.movie = async(req, res) => {
    let movieID = req.params.id
        //Getting the movie data via the API per movie ID.
    let movieAPI = await axios.get(`https://omdbapi.com/?apikey=24998e29&i=${movieID}&plot=full`)
    try {
        if (req.user.Userid) {
            //If this is a registered user, we check if movies from the list are in his favorites, if yes, a value of 1 is passed in userfav, if not, a 0 is passed.
            const usefav = await con.query(`select * from favorites where MovieID = \'${movieID}\' and Userid = ?`, [req.user.Userid], (error, result) => {


                if (result.length == 1) {
                    movieAPI.data.userfav = '1'
                    console.log(movieAPI.data);
                    res.render('movie', { movie: movieAPI.data, user: req.user })
                } else {
                    movieAPI.data.userfav = '0'
                    res.render('movie', { movie: movieAPI.data, user: req.user })
                }
            })

        }

    } catch (err) {
        if (movieAPI.data.Response == 'False') {
            //If there is no response to our call, we return an error to the page.
            res.render('movie', { movie: movieAPI.data.error, user: req.user })
        } else {
            //send the movie to the page for rendering.
            res.render('movie', { movie: movieAPI.data, user: req.user })
        }
    }
};

//This is the movie controller middleware for the search page.  The user submits the search form, the API response is saved in an array and rendered on the page. this middleware is called through the route in the auth.js file.
exports.search = async(req, res, next) => {
    let search = req.body.search
        //Getting the movies data via the API per search term.
    let movieAPI = await axios.get(`https://omdbapi.com/?apikey=24998e29&s=${search}&type=movie`)
        //If there aren't any results, show the error on the page.
    if (!movieAPI.data.totalResults) {
        res.render(`search`, { movies: movieAPI.data.error, user: req.user })
    } else {
        try {
            //If this is a registered user, we check in the DB, by movie ID and user ID if this movie is in the users favorites. if yes, a value of 1 is passed in userfav, if not, a 0 is passed.

            if (req.user.Userid) {
                let movielist = [];
                for (let i = 0; i < movieAPI.data.Search.length - 1; i++) {

                    let id = movieAPI.data.Search[i].imdbID


                    const result = await query(`select * from favorites where MovieID = \'${id}\' and Userid = ?`, [req.user.Userid]);


                    if (result.length == 1) {
                        movieAPI.data.Search[i].userfav = '1'
                        movielist.push(movieAPI.data.Search[i])
                    } else {
                        movieAPI.data.Search[i].userfav = '0'
                        movielist.push(movieAPI.data.Search[i])
                    }

                }
            } else {
                return
            }

        } catch (err) {
            ////send the list to the page for rendering.
            res.render(`search`, { movies: movieAPI.data.Search, user: req.user })
        }
        res.render(`search`, { movies: movieAPI.data.Search, user: req.user })

    }

};

//This is the movie controller middleware for the favorites page.  When the favorites page is called , this middleware is called through the route in the auth.js file.
exports.favorites = async(req, res, next) => {
    //Getting the list of favorite movies per user from the DB.
    try {
        con.query('select * from favorites where Userid = ?', [req.user.Userid], async(err, result) => {
            console.log(result);
            if (err) throw err;
            else {
                // Putting the list of movies into an array.
                let movielist = [];

                for (let i = 0; i < result.length; i++) {
                    debugger;
                    let id = result[i].MovieID;
                    //Getting the data for each movie in the array from the API.
                    const movieAPI = await axios.get(`https://omdbapi.com/?apikey=24998e29&i=${id}&type=movie`)
                        //Setting the userfav value to 1.
                    movieAPI.data.userfav = '1'
                    movielist.push(movieAPI.data)
                }
                //rendering the favorites page.
                res.render('favorites', { movies: movielist, user: req.user })
            }

        })
    } catch (error) {
        console.log(error);
        return next();
    }

};

//When a user clicks on the "like" button, we insert the userID and movie ID into the favorites table in the DB.
exports.add = async(req, res, next) => {

    console.log(req.user);
    console.log(req.body);

    try {
        con.query(`insert into favorites values ('${req.user.Userid}', '${req.body.id}')`, async(err, result) => {
            console.log(result);
            if (err) throw err;
        })
    } catch (error) {
        console.log(error);

    }
    return res.status(200).send({});
};

//When a user clicks on the "unlike" button, we remove the userID and movie ID from the favorites table in the DB.
exports.remove = async(req, res, next) => {
    console.log(req.user);
    console.log(req.body);
    try {
        con.query(`delete from favorites where Userid = ? and MovieID = '${req.body.id}'`, [req.user.Userid], async(err, result) => {
            console.log(result);
            if (err) throw err;
        })
    } catch (error) {
        console.log(error);

    }
    return res.status(200).send({});
};