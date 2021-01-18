console.log("this is working");

//node modules

var express = require('express');
var http = require ('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
const { css } = require('jquery');

app.use(bodyParser.urlencoded({extended:true}));

var dateFormat = require('dateformat');
var now = new Date();

//view engne

app.set('view engine', 'ejs');
// JS/css
app.use('/node_modules', express.static('node_modules'));

// Connect Server

var server = app.listen(3000, () => console.log("Server started on port 3000."));

//Connection Details

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lenhat1207",
    database: "events"
});
    
//site title/url
const siteTitle ="Simple App";
const baseURL ="http://localhost:3000/";

//mysql query

app.get("/", function(req,res) {
    con.query("SELECT * FROM events_table ORDER BY eventstarttime DESC", function(err, results){
        
        res.render('pages/index',{  
            siteTitle : siteTitle,
            pageTitle : "Event list",
            items : results
        });   
     });
}); 

// add new event
app.get("/event/add", function(req,res) {
    
        res.render('pages/add-event.ejs',{  
            siteTitle : siteTitle,
            pageTitle : "Add New Event",
            items : ''
        });   
     });

app.post('/event/add', function(req,res) {

    // get record on id

var query =     "INSERT INTO `events_table` (eventname ,eventstarttime, eventendtime, eventdescription, eventlocation) VALUES(";
    query +=    " '"+req.body.eventname+"',";
    query +=    " '"+dateFormat(req.body.eventstarttime,"yyyy-mm-dd")+"',";
    query +=    " '"+dateFormat(req.body.eventendtime,"yyyy-mm-dd")+"',";
    query +=    " '"+req.body.eventdescription+"',";
    query +=    " '"+req.body.eventlocation+"')";           
    console.log(query.toString());
    con.query(query,function(err,result){
    res.redirect(baseURL);
    }); 
});

//retrieve data 
app.get('/event/edit/:id', function(req,res){

    con.query(" SELECT * FROM events_table WHERE eventid ='" +req.params.id+"'",
    function(err,result) {

        result[0].eventstarttime = dateFormat(result[0].eventstarttime,"yyyy-mm-dd");
        result[0].eventendtime = dateFormat(result[0].eventendtime,"yyyy-mm-dd");

        res.render('pages/edit-event',{
            siteTitle : siteTitle,
            pageTitle : "Editing event : " + result[0].eventname,
            item: result
        });
    });
});

// update table

app.post('/event/edit/:eventid', function(req,res) {

    // get record on id

var query =     "UPDATE `events_table` SET";
    query +=    " `eventname` = '"+req.body.eventname+"',";
    query +=    " `eventstarttime` = '"+req.body.eventstarttime+"',";
    query +=    " `eventendtime` = '"+req.body.eventendtime+"',";
    query +=    " `eventdescription` = '"+req.body.eventdescription+"',";
    query +=    " `eventlocation` = '"+req.body.eventname+"'";  
    query +=    " WHERE `events_table`.`eventid` = "+req.body.eventid+"";       
    console.log(query.toString());
    con.query(query,function(err, result) {

        result.affectedRows.toString();
        if(result.affectedRows)
        {
            res.redirect(baseURL);
        }
    
    }); 
});

//delete record

app.get('/event/delete/:eventid', function(req,res){

    con.query("DELETE FROM events_table where eventid ='"+req.params.eventid+"'", function(err, result){
        if(result.affectedRows)
        {
            res.redirect(baseURL);
        }

    });
});




    
   


