const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const session = require('express-session')
const exphbs  = require('express-handlebars')
const MongoStore = require('connect-mongo')(session)
const {formatDate, truncate} = require('./helpers/hbs')
const app = express()

//Setup
dotenv.config({path: './config/config.env'})
connectDB()
require('./config/passport')(passport)

//Initialization
app.use(session({
    secret: 'DL9ca#)$!',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({extended: true}))
app.engine('.hbs', exphbs({helpers: {formatDate, truncate}, defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Static
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/posts', require('./routes/posts'))

//Listen
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening to port: ${port} in environment: ${process.env.NODE_ENV}`))