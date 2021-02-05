
var mongoose = require('mongoose');

//data connection
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://Michaeldple1:finalcrusade909@testcluster.o2ekz.mongodb.net/<testcluster>',
 {useNewUrlParser: true });

//create schema
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
// var data = [{item:'get milk'}, {item:'kill people'}, {item: 'annhilate countries'}];
module.exports = function(app){

app.get('/todo', function(req, res){
    //get data from mongodb and pass to view 
    Todo.find({}, function(err, data){
        if(err) throw err;
        res.render('todo', {todos: data});
    })
   
});    

app.post('/todo', urlencodedParser, function(req, res){
    // get data from view and add it to the db
    var newToDo = Todo(req.body).save(function(err,data){
        console.log(req.data)
        if(err) throw err;
        res.json(data);
    })
});  

app.delete('/todo/:item', function(req,res){
    //delete the requested item from db
    Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
        if (err) throw err;
        res.json(data);
    })
 });

};