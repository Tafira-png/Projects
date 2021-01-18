const { json } = require("body-parser");
var express = require("express");
var router = express.Router();  
const { check, oneOf, validationResult } = require('express-validator')
var auth = require('../config/auth.js');
var isAdmin = auth.isAdmin;

//get pages model

var Page = require("../models/page")




//get pages index

router.get('/', isAdmin, (req,res) => {
    Page.find({}).sort({sorting:1}).exec(function(err,pages){
res.render('admin/pages',  {
            pages: pages
        });
    });
});



//get add index

router.get('/add-page', isAdmin, (req,res) => { 

    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add_page', {
        title : title,
        slug :slug,
        content: content

    });
});

//edit add page


router.get('/edit-page/:id', isAdmin, (req,res) => { 

   Page.findById( req.params.id, 
    (err, page) => {if(err) return console.log(err); 
        console.log(page._id)
    res.render('admin/edit_page', {
        title : page.title,
        slug : page.slug,
        content: page.content,
        id: page._id
        })
    });
});

//post add page
router.post('/add-page',[
check('title',"Title must have a value").exists({checkFalsy:true, checkNull:true}),
check('content',"content must have a value").exists({checkFalsy:true, checkNull:true})],
(req,res) => { 
     
    var errors = validationResult(req);
      extractederrors = []
      errors.array().map(err => extractederrors.push(err.msg));
      console.log(extractederrors);
      console.log(req.body)
   
    var title = req.body.title;
    var content = req.body.content;
    var slug = req.body.slug.replace(/\s+/g,"-").toLowerCase();
    if (slug == "" || slug == null) {slug = title.replace(/\s+/g,"-").toLowerCase();}
   

    if(extractederrors.length) {
        res.render('admin/add_page', {
            errors: extractederrors,
            title : title,
            slug :slug,
            content: content
    
        });
    } else {
        console.log('success')
        Page.findOne({slug:slug}, function(err,page) {
            if(page) {
                req.flash('danger','Page slug exists, choose another.');
                res.render('admin/add_page', {
                    title : title,
                    slug :slug,
                    content: content,
            
                })
            }
            else{
                 var page = new Page({
                    title : title,
                    slug :slug,
                    content: content,
                    sorting: 100,
                 });
                 page.save( err => {if (err) return console.log(err);
                  
                        Page.find({}).sort({sorting:1}).exec(function(err,pages){
                            if(err){
                              console.log(err);
                            } else {
                              req.app.locals.pages = pages;
                            }
                          });
                   
                    req.flash('success','Page added');
                    res.redirect('/admin/pages');
                
                });

            }
        })
    }

  
});

//sort pages function
function sortPages(ids, callback){

    var count = 0;

    for (var i = 0; i< ids.length; i++){
        var id = ids[i];
        count++;

        (function (count) {
        Page.findById(id, function(err,page){
             page.sorting = count;
            page.save(function(err) {
                if (err)
                 return console.log(err);
                ++count;
                if (count >= ids.length){
                    callback();
                }
            });
         });      
    
    }) (count);
    }

}

//post reorder pages

router.post('/reorder-pages', (req,res) => {
    var ids = req.body['id[]'];

    sortPages(ids, function(){
        Page.find({}).sort({sorting:1}).exec(function(err,pages){
            if(err){
              console.log(err);
            } else {
              req.app.locals.pages = pages;
            }
          });
    })
   
});


// post edit page


router.post('/edit-page/:id',[
    check('title',"Title must have a value").exists({checkFalsy:true, checkNull:true}),
    check('content',"content must have a value").exists({checkFalsy:true, checkNull:true})],
    (req,res) => { 
         
        var errors = validationResult(req);
          extractederrors = []
          errors.array().map(err => extractederrors.push(err.msg));
          console.log(extractederrors);
        
        var title = req.body.title;
        var content = req.body.content;
        var id = req.params.id;
        var slug = req.body.slug.replace(/\s+/g,"-").toLowerCase();
        if (slug == "" || slug == null) {slug = title.replace(/\s+/g,"-").toLowerCase();}
       
    
        if(extractederrors.length) {
            res.render('admin/edit_page', {
                errors: extractederrors,
                title : title,
                slug :slug,
                content: content,
                id : id 
        
            });
        } else {
            console.log('success')
            Page.findOne({slug:slug, _id:{'$ne': id}}, function(err,page) {
                if(page) {
                    // extractederrors.push("Page slug exists, please choose another.")
                    req.flash('danger','Page slug exists, choose another.');
                    res.render('admin/edit_page', {
                        errors: extractederrors,
                        title : title,
                        slug :slug,
                        content: content,
                        id: id
                
                    })
                }
                else{
                    Page.findById(id, function(err, page){
                        if(err) return console.log(err);

                        page.title = title; 
                        page.slug = slug;
                        page.content = content;
                        page.save( err => {if (err) return console.log(err);
                            //reorder home page
                            Page.find({}).sort({sorting:1}).exec(function(err,pages){
                                if(err){
                                console.log(err);
                                } else {
                                req.app.locals.pages = pages;
                                    }   
                                });
                            req.flash('success','Page edited');
                            res.redirect('/admin/pages/edit-page/'+ id);
                        
                        });
                    })                   
    
                }
            })
        }
    
      
    });

//get delete posts
    router.get('/delete-page/:id', isAdmin, (req,res) => {
        Page.findByIdAndRemove(req.params.id, function(err) { 
            if (err) 
                return console.log(err);
             
                Page.find({}).sort({sorting:1}).exec(function(err,pages){
                    if(err){
                    console.log(err);
                    } else {
                    req.app.locals.pages = pages;
                        }   
                    });
               

            req.flash('success','Page deleted!');
            res.redirect('/admin/pages/')

        });
    });
    




//exports

module.exports = router

