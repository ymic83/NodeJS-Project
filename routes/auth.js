const express = require('express');
const authController = require('../controllers/auth');
const movieController = require('./movies');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post(`/search`, authController.isLoggedIn, movieController.search);

router.get('/logout', authController.logout);

router.post('/add/', authController.isLoggedIn, movieController.add);

router.post('/remove/', authController.isLoggedIn, movieController.remove);

router.get('/', authController.isLoggedIn, movieController.home, (req, res) => {
    res.render('movies');

});

router.get('/register', authController.isLoggedIn, (req, res) => {
    if (!req.user) {
        res.render('register', {
            user: req.user,
            message: ''
        });
    } else {
        res.redirect('/');
    }
});

router.get('/login', authController.isLoggedIn, (req, res) => {
    if (!req.user) {
        res.render('login', {
            user: req.user,
            message: ''
        });
    } else {
        res.redirect('/');
    }
});

router.get('/favorites', authController.isLoggedIn, movieController.favorites, (req, res) => {
    if (req.user) {
        res.render('favorites', {
            user: req.user
        });
    } else {
        res.redirect('/');
    }
});

router.get('/movie/:id', authController.isLoggedIn, movieController.movie, (req, res) => {
    res.render('movie');
});


module.exports = router;