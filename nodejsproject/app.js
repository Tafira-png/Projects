var express = require('express');
var controllers = require('./controllers/todocontroller');
var path = require('path'); 
var app = express();


// set up template engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//static
app.use(express.static(path.join(__dirname, 'public')));


//fire controllers
controllers(app);

// port listen
app.listen(3000);
console.log('Listening to port 3000');
