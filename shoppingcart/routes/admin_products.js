const { json } = require("body-parser");
var express = require("express");
var router = express.Router();  
const { check, body, oneOf, validationResult } = require('express-validator');
var fse = require("fs-extra");
var resizeImg = require("resize-img");
const path = require('path');
const mkdirp = require('mkdirp');
var auth = require('../config/auth.js');
var isAdmin = auth.isAdmin;

//get productmodel/category model

var Product = require("../models/product")
var Category = require("../models/category");
const product = require("../models/product");


//validator function



//get products index

router.get('/', isAdmin, (req,res) => {
    var count;

    Product.countDocuments(function(err,c) {
        count = c;
    });


    Product.find(function(err, products){
        res.render('admin/products', {
            products: products,
            count:count
        })
    });
    
});



//get add product

router.get('/add-product',isAdmin, (req,res) => { 

    var title = "";
    var desc = "";
    var price = "";

Category.find(function(err,categories) {
    res.render('admin/add-product', {
        title : title,
        desc :desc,
        price: price,
        categories: categories

    });
})
    
});

//edit add page


router.get('/edit-page/:id',isAdmin, (req,res) => { 

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

//post add product
router.post('/add-product',
[
    check('title',"Title must have a value")
        .exists({checkFalsy:true, checkNull:true}),
    check('desc',"Description must have a value")
        .exists({checkFalsy:true, checkNull:true}),
    check('price',"Price must have a value")
        .exists({checkFalsy:true, checkNull:true}).isDecimal().withMessage("Price must be a decimal or number."),
    check('image',"You must upload a valid image").
    custom((value, { req, location,}) => { 
           image = req.files != null ? req.files.image.name : ""
           value = (path.extname(image)).toLowerCase();
           switch(value) {
            case '.jpg':
                return '.jpg'
            case '.jpeg':
                return '.jpeg'
            case '.png':
                return '.png'
            case '':
                return '.jpg'
            default:
                return false
           }
      

    })
]
      
, (req,res) => { 
    imageFile = (req.files != null) ? req.files.image.name : ""
    
    var errors = validationResult(req);
      extractederrors = []
      errors.array().map(err => extractederrors.push(err.msg));
      console.log(extractederrors);
      console.log(req.body)
   
    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var slug = title.replace(/\s+/g,"-").toLowerCase();
   
    
    if(extractederrors.length) {
        Category.find(function(err,categories) {
            res.render('admin/add-product', {
                errors: extractederrors,
                title : title,
                desc :desc,
                price: price,
                categories: categories,
                image: imageFile
            });
        })
       
    } 
    else {
        console.log('success')
        Product.findOne({slug:slug}, function(err,product) {
            if(product) {
                req.flash('danger','Product title exists, choose another.');
                Category.find(function(err,categories) {
                    res.render('admin/add-product', {
                        title : title,
                        desc :desc,
                        price: price,
                        categories: categories
                    });
                })
            }
            else {
                 var price2 = parseFloat(price).toFixed(2);
                 var product = new Product({
                    title : title,
                    slug :slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                   
                 });
                product.save( err => {if (err) return console.log(err);
                // databaseID = product._id
                mkdirp.sync('public/product_images/'+ product._id );
                mkdirp.sync('public/product_images/'+ product._id + "/gallery")
                mkdirp.sync('public/product_images/'+ product._id + "/gallery/thumbs")

                    if(imageFile !="") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/'+ product._id + "/" + imageFile;

                        productImage.mv(path, (err) =>  console.log(err))
                     }

                    req.flash('success','Product added');
                    res.redirect('/admin/products');
                
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


// post edit product get


router.get('/edit-product/:id',
    (req,res) => { 

        var errors;

        if (req.session.errors) errors = req.session.errors;
        req.session.errors = null
         
        Category.find(function(err,categories) {
            Product.findById(req.params.id, (err,p) => {
                if(err) {
                    console.log(err);
                    res.redirect('/admin/products')
                } else {
                    var galleryDir = 'public/product_images/'+ p._id + '/gallery';
                    var galleryImages = null;
                    fse.readdir(galleryDir, function(err, files) {
                        if (err) {
                            console.log(err)
                        } else {
                            galleryImages = files;
                                
                            res.render('admin/edit-product', {
                                id : p._id,
                                title : p.title,
                                errors: errors,
                                desc :p.desc,
                                price: p.price,
                                categories: categories,
                                category: p.category.replace(/\s+/g, "-").toLowerCase(),
                                image : p.image,
                                galleryImages: galleryImages
                            });
                        }
                    })

                }
            })
        })  
    });


 //post edit product
 
 router.post('/edit-product/:id',
 [ 
   check('title',"Title must have a value")
    .exists({checkFalsy:true, checkNull:true}),
   check('desc',"Description must have a value")
    .exists({checkFalsy:true, checkNull:true}),
   check('price',"Price must have a value")
    .exists({checkFalsy:true, checkNull:true})
    .isDecimal()
    .withMessage("Price must be a decimal or number."),
   check('image',"You must upload a valid image")   
    .custom((value, { req, location,}) => { 
    image = req.files != null ? req.files.image.name : ""
    value = (path.extname(image)).toLowerCase();
    switch(value) {
     case '.jpg':
         return '.jpg'
     case '.jpeg':
         return '.jpeg'
     case '.png':
         return '.png'
     case '':
         return '.jpg'
     default:
         return false
    }
})
], 
(req,res) => {
    imageFile = (req.files != null) ? req.files.image.name : ""
    
    var errors = validationResult(req);
      extractederrors = []
      errors.array().map(err => extractederrors.push(err.msg));
      console.log(extractederrors);
      console.log(res.files)
   
    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var slug = title.replace(/\s+/g,"-").toLowerCase();
    var pimage = req.body.pimage
    var id = req.params.id
    
    
    if(extractederrors.length) {
        Category.find(function(err,categories) {
            res.render("admin/edit-product" , {
                id: id,
                errors: extractederrors,
                title : title,
                desc :desc,
                price: price,
                categories: categories,
                category: category
                
            });
        })
       
    } 
    else {
        console.log('success')
        Product.findOne({slug:slug, _id:{'$ne': id}}, function(err,product) {
          
            if(err) {
                console.log(err)
            }
            if(product) {
                
                req.flash('danger','Product title exists, choose another.');
                Category.find(function(err,categories) {
                    res.render("admin/edit-product" + id, {
                        id: id,
                        title : title,
                        desc :desc,
                        price: price,
                        categories: categories,
                        category: category,
                        slug : slug
                    });
                })
            }
            else {
                Product.findById(id, (err,p) => {
                    if(err)
                    console.log(err);
                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if(imageFile !=="") {
                        p.image = imageFile;   
                    }
                    p.save(function(err){
                        if(err) console.log(err);

                        if(imageFile !="") {
                            if(pimage !="") {
                                fse.remove('public/product_images/'+ id +'/' + pimage, function(err){
                                    if(err) console.log(err)
                                });
                            }
                        var productImage = req.files.image;
                        var path = 'public/product_images/'+ id +"/" + imageFile;

                        productImage.mv(path, (err) =>  console.log(err))
                        }
                    })
                    req.flash('success','Product edited');
                    res.redirect('/admin/products/edit-product/'+ id);
                
                })

            }
        })
    }
 })

//post galleryimages
router.post('/product-gallery/:id', (req,res) => {
    
    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' +id +'/gallery/' + req.files.file.name
    var thumbsPath = 'public/product_images/' +id +'/gallery/thumbs/' + req.files.file.name

    productImage.mv(path, function(err){
        if(err) console.log(err)

        resizeImg(fse.readFileSync(path), {width:100, height: 100}).then(function(buf){
            fse.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);
});


//get delete galleryimages
router.get('/delete-image/:image', isAdmin, (req,res) => {

var originalImage = 'public/product_images/' + req.query.id +'/gallery/' + req.params.image
var thumbImage = 'public/product_images/' + req.query.id +'/gallery/thumbs' + req.params.image
    
    fse.remove(originalImage, (err) => {
         if(err) {console.log(err)}
         else {
         fse.remove(thumbImage, (err) => {if(err) {
             console.log(err)}
            else{
                req.flash('success','Image deleted');
                res.redirect('/admin/products/edit-product/'+ req.query.id);
                }
            });
    }});
});




//get delete product
    router.get('/delete-product/:id', isAdmin, (req,res) => {
    
        var id = req.params.id
        var path = 'public/product_images/' + id;
    
        fse.remove(path, (err)=> {if(err) {
            console.log(err)
        }
            else{
                Product.findByIdAndRemove(id, (err) => console.log(err))
                req.flash('success','Product deleted');
                res.redirect('/admin/products/');
            };
        });

    });

//exports

module.exports = router

