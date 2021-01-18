const { json } = require("body-parser");
var express = require("express");
var router = express.Router();  
const { check, oneOf, validationResult } = require('express-validator')
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

//get category model

var Category = require("../models/category")


// //express init
// var app = express();

//get categories index

router.get('/',isAdmin , (req,res) => {
    
  Category.find(function(err,categories){
      if(err) return console.log(err)
res.render('admin/categories',  {
            categories: categories
        });
    });
});



//get add categories

router.get('/add-category', isAdmin , (req,res) => { 

    var title = "";
  

    res.render('admin/add_category', {
        title : title,
       

    });
});

//edit add categories


router.get('/edit-category/:id', isAdmin , (req,res) => { 

   Category.findById(req.params.id, 
    (err, category) => {if(err) return console.log(err); 
        console.log(category.id)

    res.render('admin/edit_category', {
        title : category.title,
        id : category._id
        })
    });
});

//post add category
router.post('/add-category',[
check('title',"Title must have a value").exists({checkFalsy:true, checkNull:true})],

(req,res) => { 
    
    var errors = validationResult(req);
      extractederrors = []
      errors.array().map(err => extractederrors.push(err.msg));
      console.log(extractederrors);
      var title = req.body.title;
      var slug = title.replace(/\s+/g,"-").toLowerCase();
      console.log(req.body);
     
   
    if(extractederrors.length) {
        res.render('admin/add_category', {
            errors: extractederrors,
            title : title
            
        });
         
    } else {
        console.log('success')
        Category.findOne({slug:slug}, function(err,category) {
            if(category) {
                req.flash('danger','Category title exists, choose another.');
                res.render('admin/add_category', {
                    title : title               
                })
            }
            else{
                 var category = new Category({
                    title : title,
                    slug :slug
                    
                 });
                category.save( err => {if (err) return console.log(err);
                    //reload categories for front-end
                    Category.find(function(err,categories){
                        if(err){
                          console.log(err); 
                        }
                          res.locals.categories = categories;
                          console.log(categories)
                        }
                      )
                    req.flash('success','Category added');
                    res.redirect('/admin/categories');
                
                });

            }
        })
    }

  
});



//post reorder pages

router.post('/reorder-pages', (req,res) => {
    var ids = req.body['id[]'];
    var count = 0;

    for (var i = 0; i< ids.length; i++){
        var id = ids[i];
        count++;
        (function (count) {
        Page.findById(id,function(err,page){
             page.sorting = count;
            page.save(function(err){
                if (err)
                 return console.log(err);
            });
         });      
    
    }) (count);
    }
});


// post edit page


router.post('/edit-category/:id',[
    check('title',"Title must have a value").exists({checkFalsy:true, checkNull:true})
    ],
    (req,res) => { 
         
        var errors = validationResult(req);
          extractederrors = []
          errors.array().map(err => extractederrors.push(err.msg));
          console.log(extractederrors);
       
        var title = req.body.title;
        var id = req.params.id;
        var slug = title.replace(/\s+/g,"-").toLowerCase()
        
       
    
        if(extractederrors.length) {
            res.render('admin/edit_category', {
                errors: extractederrors,
                title : title,
                id : id 
        
            });
        } else {
            console.log('success')
            Category.findOne({slug:slug, _id:{'$ne': id}}, function(err,category) {
                if(category) {
                    // extractederrors.push("Page slug exists, please choose another.")
                    req.flash('danger','Category title exists, choose another.');
                    res.render('admin/edit_category', {
                        errors: extractederrors,
                        title : title,
                        id: id
                
                    });
                }
                else{
                    Category.findById(id, function(err, category){
                        if(err) return console.log(err);

                        category.title = title; 
                        category.slug = slug;
                        category.save( err => {if (err) return console.log(err);
                            //reload categories for front end
                            Category.find(function(err,categories){
                                if(err){
                                  console.log(err); 
                                }
                                  res.locals.categories = categories;
                                  console.log(categories)
                                }
                              )
                            req.flash('success','Category edited');
                            res.redirect('/admin/categories/edit-category/'+ id);
                        
                        });
                    })                   
    
                }
            })
        }
    
      
    });

//get delete category
    router.get('/delete-category/:id', isAdmin , (req,res) => {
        Category.findByIdAndRemove(req.params.id, function(err) { 
            if (err) 
                return console.log(err);
                //reload category front-end
                Category.find(function(err,categories){
                    if(err){
                      console.log(err); 
                    }
                      res.locals.categories = categories;
                      console.log(categories)
                    }
                  )
            req.flash('success','Category deleted!');
            res.redirect('/admin/categories/')

        });
    });
    




//exports

module.exports = router

