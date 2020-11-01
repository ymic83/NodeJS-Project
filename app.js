const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config({ path: './.env' });

//static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/js', express.static(__dirname + 'public/js'));


//templating engine (EJS)
app.set('view engine', 'ejs');

//body parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))



//Routes
app.use('/', require('./routes/auth'));
app.use('/auth', require('./routes/auth'));
const { urlencoded } = require('body-parser');





//listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));