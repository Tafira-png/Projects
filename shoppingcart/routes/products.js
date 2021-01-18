var express = require("express");
var router = express.Router();
var fse = require("fs-extra");
var auth = require('../config/auth.js');
var isUser = auth.isUser;


const Product = require("../models/product")
const Category = require("../models/category")

//get all products
// Limited access modified route example
// router.get('/', isUser, (req,res) => 
router.get('/', (req,res) => 
Product.find((err, products) =>{
    
    if(err) console.log(err);
    res.render('all_products',{
        title:  'All products',
        products: products
    });
}));

 //get products by category
router.get('/:category', (req,res) => {

    categorySlug = req.params.category
    // console.log(categorySlug);
    Category.findOne({slug: categorySlug}, function(err, c){
        Product.find({category:categorySlug},(err, products) =>{
              console.log(c)
              console.log(err + "1")
            if(err) {console.log(err);}
            else
            { res.render('cat_products',{
                title: c.title,
                products: products
            });
        }
          
           
        });  
    })
 
});

//get product details
        
router.get('/:category/:product', function(req,res) {

    var galleryImages = null
    var loggedIn = (req.isAuthenticated()) ? true: false;
    const savedProduct = req.params.product

Product.findOne({slug: savedProduct}, function(err,p){
           
        if(err != null){
            console.log(err)
        }  
        
            var GalleryDir = 'public/product_images/' + p._id + '/gallery';
            fse.readdir(GalleryDir, function (err, files) {
                if (err) {
                    console.log(err)
                } else {
                    galleryImages = files;
                    console.log(galleryImages)

                    res.render('product', {
                        title: p.title,
                        p: p,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });

                }
            });
        

 });
 
});
        
   




//exports

module.exports = router


