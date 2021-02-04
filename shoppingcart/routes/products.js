var express = require("express");
var router = express.Router();
var fse = require("fs-extra");
var auth = require('../config/auth.js');
var isUser = auth.isUser;

const imgur = require ("../config/imgur")
const Product = require("../models/product")
const Category = require("../models/category")



//get all products
// Limited access modified route example
// router.get('/', isUser, (req,res) => 
router.get('/', (req, res) =>
    Product.find((err, products) => {

        if (err) console.log(err);
        res.render('all_products', {
            title: 'All products',
            products: products
        });
    }));

//get products by category
router.get('/:category', (req, res) => {

    categorySlug = req.params.category
    // console.log(categorySlug);
    Category.findOne({ slug: categorySlug }, function (err, c) {
        Product.find({ category: categorySlug }, (err, products) => {
            console.log(c)
            console.log(err + "1")
            if (err) { console.log(err); }
            else {
                res.render('cat_products', {
                    title: c.title,
                    products: products
                });
            }


        });
    })

});

//get product details

router.get('/:category/:product', function (req, res) {

    var galleryImages = null
    var loggedIn = (req.isAuthenticated()) ? true : false;
    const savedProduct = req.params.product
    var images = ""
    var imgurURL = ""
    Product.findOne({ slug: savedProduct }, function (err, p) {

        if (err != null) {
            console.log(err)
        }

        var galleryDir = 'public/product_images/' + p._id + '/gallery';
        var thumbsDir = galleryDir + "/thumbs"
        fse.ensureFileSync(galleryDir + "/keep", err => {
            if (err)
                console.log(err)
            else
                console.log("success")
        })
        fse.ensureFileSync(thumbsDir + "/keep", err => {
            if (err)
                console.log(err)
            else
                console.log("success")
        })
        fse.readdir(galleryDir, function (err, files) {
            if (err) {
                console.log(err)
            } else if (p.imgurURL && p.AlbumID) {
                imgurURL = p.imgurURL
                galleryImages = files;
                console.log(galleryImages)
                imgur.getAlbumID(p._id).then(ID => {
                    imgur.fetchAlbumImages(ID).then(images => {

                        console.log(images)
                        res.render('product', {
                            title: p.title,
                            p: p,
                            galleryImages: galleryImages,
                            loggedIn: loggedIn,
                            imgurGallery: images,
                            imgurURL: imgurURL
                        })

                    })
                })
               

            } else {
                galleryImages = files;
                res.render('product', {
                    title: p.title,
                    p: p,
                    galleryImages: galleryImages,
                    loggedIn: loggedIn,
                    imgurGallery: images,
                    imgurURL: imgurURL
                });
            }
        });


    });

});






//exports

module.exports = router


