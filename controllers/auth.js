const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');


const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTIONNUM
});


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        //Making sure the email and password sections aren't empty.
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }
        //Verifying that the email exists and the password entered matches the password stored.
        db.query('SELECT * FROM users WHERE Email = ?', [email], async(error, results) => {
            console.log(results);

            if (!results || !(await bcrypt.compare(password, results[0].Password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            } else {
                const id = results[0].Userid;
                //Getting the token from the cookie
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                //Resetting the expiration date on the cookie.
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }

        })

    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);
    //The register form is submitted with all the values.
    const { firstName, lastName, email, password, passwordConfirm } = req.body;
    //Checking to make sure the email doesn't already exist.
    db.query('SELECT email FROM users WHERE email = ?', [email], async(error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }
        //Changing the password from regular text to encryption via bcrypt.
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        //Once the user registration verification process is done, the user is added to the DB and now has to login.
        db.query('INSERT INTO users SET ?', { FirstName: firstName, LastName: lastName, Email: email, Password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('login');
            }
        })


    });

}

exports.isLoggedIn = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            //verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            );



            // Check if the user still exists
            db.query('SELECT * FROM users WHERE Userid = ?', [decoded.id], (error, result) => {

                if (!result) {
                    return next();
                }

                req.user = result[0];;
                return next();

            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async(req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).redirect('/');
}