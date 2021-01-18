const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var passport = require('passport');


//init app
var app = express();

//init db connetion
mongoose.set('useUnifiedTopology', true);
mongoose.connect(config.database,  {useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () =>
{
    console.log("Connected to mongodb");
})

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//set static public folder
app.use(express.static(path.join(__dirname, 'public')));

//set global err variable
app.locals.errors = null;

//get page model
var Page = require("./models/page")
//get all pages to pass to header.ejs
Page.find({}).sort({sorting:1}).exec(function(err,pages){
        if(err){
          console.log(err);
        } else {
          app.locals.pages = pages;
        }
      });


//get category model
var Category = require("./models/category")
// get all categories
Category.find(function(err,categories){
  if(err){
    console.log(err); 
  }
    app.locals.categories = categories;
  }
)

// setup express fileupload
app.use(fileUpload());

//init bodyParser types

app.use(bodyParser.urlencoded({ extended: false }))

//Express Sessions

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// Passport Config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get("*", function(req,res,next) {
    res.locals.cart = req.session.cart;
    res.locals.users = req.user || null
    next();
})



//set routes
var pages = require('./routes/pages.js')
var cart= require('./routes/carts.js')
var users = require('./routes/users.js')
var products= require('./routes/products.js')
var adminpages = require('./routes/admin_pages.js')
var adminCategories = require('./routes/admin_categories.js')
var adminProducts = require('./routes/admin_products.js')

app.use('/products', products);
app.use('/admin/pages', adminpages);
app.use('/admin/products', adminProducts)
app.use('/admin/categories', adminCategories)
app.use('/cart', cart)
app.use('/users', users)
app.use('/', pages);


// start server
var port = 3000;
app.listen(port, () => console.log("Server listening on port " + port));
