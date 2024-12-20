require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = 4000 || process.env.PORT; // Local Port and the Online Server Port

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout); //It's a middleware that helps manage common layouts (header, footer, etc.) across different pages, making it easier to reuse code and structure.
app.set('layout', './layouts/main'); //refers to the main layout file (usually main.ejs), which contains the overall structure for your web pages (like the header, footer, and a placeholder for content).
app.set('view engine', 'ejs'); //This tells the app that EJS (Embedded JavaScript) is the templating engine to be used for rendering views (HTML-like pages).

app.locals.isActiveRoute = isActiveRoute; 

app.use('/',require("./server/routes/main"));
app.use('/', require('./server/routes/admin'));

app.listen(PORT,()=>{
  console.log(`App listening on port ${PORT}`);
});