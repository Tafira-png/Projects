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


//imgur custom functions
var imgur = require("../config/imgur")

//get productmodel/category model

var Product = require("../models/product")
var Category = require("../models/category");




     

//get products index

router.get('/', isAdmin, (req, res) => {
    var count;

    Product.countDocuments(function (err, c) {
        count = c;
        
    }).then(
        Product.find(function (err, products) {
            res.render('admin/products', {
                products: products,
                count: count
            })
    
        })
    )


    

});



//get add product

router.get('/add-product', isAdmin, (req, res) => {

    var title = "";
    var desc = "";
    var price = "";

    Category.find(function (err, categories) {
        res.render('admin/add-product', {
            title: title,
            desc: desc,
            price: price,
            categories: categories

        });
    })

});

//edit add page


router.get('/edit-page/:id', isAdmin, (req, res) => {

    Page.findById(req.params.id,
        (err, page) => {
            if (err) return console.log(err);
            
          
            res.render('admin/edit_page', {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id
            })
        });
});

//post add product
router.post('/add-product',
    [
        check('title', "Title must have a value")
            .exists({ checkFalsy: true, checkNull: true }),
        check('desc', "Description must have a value")
            .exists({ checkFalsy: true, checkNull: true }),
        check('price', "Price must have a value")
            .exists({ checkFalsy: true, checkNull: true }).isDecimal().withMessage("Price must be a decimal or number."),
        check('image', "You must upload a valid image").
            custom((value, { req, location, }) => {
                image = req.files != null ? req.files.image.name : ""
                value = (path.extname(image)).toLowerCase();
                switch (value) {
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

    , (req, res) => {
        imageFile = (req.files != null) ? req.files.image.name : ""
        file  = req.files.image 
        var errors = validationResult(req);
        extractederrors = []
        errors.array().map(err => extractederrors.push(err.msg));
        console.log(extractederrors);
        // console.log(req)
        
        var title = req.body.title;
        var desc = req.body.desc;
        var price = req.body.price;
        var category = req.body.category;
        var slug = title.replace(/\s+/g, "-").toLowerCase();
        


        if (extractederrors.length) {
            Category.find(function (err, categories) {
                res.render('admin/add-product', {
                    errors: extractederrors,
                    title: title,
                    desc: desc,
                    price: price,
                    categories: categories,
                    image: imageFile
                });
            })

        }
        else {
            console.log('success')
            Product.findOne({ slug: slug }, function (err, product) {
                if (product) {
                    req.flash('danger', 'Product title exists, choose another.');
                    Category.find(function (err, categories) {
                        res.render('admin/add-product', {
                            title: title,
                            desc: desc,
                            price: price,
                            categories: categories
                        });
                    })
                }
                else {
                   
                    var price2 = parseFloat(price).toFixed(2);
                    var product = new Product({
                        title: title,
                        slug: slug,
                        desc: desc,
                        price: price2,
                        category: category,
                        image: imageFile,
                        
                    });
                    product.save(err => {
                        if (err) return console.log(err);
                         databaseID = product._id
                        mkdirp.sync('public/product_images/' + databaseID);
                        mkdirp.sync('public/product_images/' + databaseID + "/gallery")
                        mkdirp.sync('public/product_images/' + databaseID+ "/gallery/thumbs")
                        
                        imgur.formDataPrep(imageFile, file, databaseID, false).then(data => {
                            imgur.uploadImage(data, databaseID)
                        })
                        imgur.albumCreatelbumCreate(databaseID);

                   

                        req.flash('success', 'Product added');
                        res.redirect('/admin/products');

                    });

                }
            })
        }


    });



//post reorder pages

router.post('/reorder-pages', (req, res) => {
    var ids = req.body['id[]'];
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                });
            });

        })(count);
    }
});


// get edit product page


router.get('/edit-product/:id',
    (req, res) => {

        var errors;

        if (req.session.errors) errors = req.session.errors;
        req.session.errors = null

        Category.find(function (err, categories) {
            Product.findById(req.params.id, (err, p) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/products')
                } else {

                    var imgurURL = ""
                    var images = ""
                    var galleryDir = 'public/product_images/' + p._id + '/gallery';
                    var galleryImages = null;
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
                            imgur.getAlbumID(req.params.id).then(ID => {
                                imgur.fetchAlbumImages(ID).then(images => {
                                    console.log(images)
                                    res.render('admin/edit-product', {
                                        id: p._id,
                                        title: p.title,
                                        errors: errors,
                                        desc: p.desc,
                                        price: p.price,
                                        categories: categories,
                                        category: p.category.replace(/\s+/g, "-").toLowerCase(),
                                        image: p.image,
                                        galleryImages: galleryImages,
                                        imgurGallery: images,
                                        imgurURL: imgurURL
                                    })

                                })
                            })
                        } else {
                            galleryImages = files;
                            res.render('admin/edit-product',
                                {
                                    id: p._id,
                                    title: p.title,
                                    errors: errors,
                                    desc: p.desc,
                                    price: p.price,
                                    categories: categories,
                                    category: p.category.replace(/\s+/g, "-").toLowerCase(),
                                    image: p.image,
                                    galleryImages: galleryImages,
                                    imgurURL: imgurURL,
                                    imgurGallery: images,

                                })
                        }
                    })

                }
            })
        })
    });


//post edit product

router.post('/edit-product/:id',
    [
        check('title', "Title must have a value")
            .exists({ checkFalsy: true, checkNull: true }),
        check('desc', "Description must have a value")
            .exists({ checkFalsy: true, checkNull: true }),
        check('price', "Price must have a value")
            .exists({ checkFalsy: true, checkNull: true })
            .isDecimal()
            .withMessage("Price must be a decimal or number."),
        check('image', "You must upload a valid image")
            .custom((value, { req, location, }) => {
                image = req.files != null ? req.files.image.name : ""
                value = (path.extname(image)).toLowerCase();
                switch (value) {
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
    (req, res) => {
        imageFile = (req.files != null) ? req.files.image.name : ""
        var file = (req.files != null ) ? req.files.image : ""
        var errors = validationResult(req);
        extractederrors = []
        errors.array().map(err => extractederrors.push(err.msg));
        console.log(extractederrors);
        console.log(res.files)

        var title = req.body.title;
        var desc = req.body.desc;
        var price = req.body.price;
        var category = req.body.category;
        var slug = title.replace(/\s+/g, "-").toLowerCase();
        var pimage = req.body.pimage
        var id = req.params.id


        if (extractederrors.length) {
            Category.find(function (err, categories) {
                res.render("admin/edit-product", {
                    id: id,
                    errors: extractederrors,
                    title: title,
                    desc: desc,
                    price: price,
                    categories: categories,
                    category: category

                });
            })

        }
        else {
            console.log('success')
            Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, product) {

                if (err) {
                    console.log(err)
                }
                if (product) {

                    req.flash('danger', 'Product title exists, choose another.');
                    Category.find(function (err, categories) {
                        res.render("admin/edit-product" + id, {
                            id: id,
                            title: title,
                            desc: desc,
                            price: price,
                            categories: categories,
                            category: category,
                            slug: slug
                        });
                    })
                }
                else {
                    Product.findById(id, (err, p) => {
                        if (err)
                            console.log(err);
                        p.title = title;
                        p.slug = slug;
                        p.desc = desc;
                        p.price = parseFloat(price).toFixed(2);
                        p.category = category;
                        if (imageFile !== "") {
                            p.image = imageFile;                           
                        }
                        p.save(function (err) {
                            if (err) console.log(err);

                            if (imageFile != "") {
                                if (pimage != "") {
                                    fse.remove('public/product_images/' + id + '/' + pimage, function (err) 
                                    {
                                        if (err) console.log(err)
                                        imgur.deleteImage(id);
                                        imgur.formDataPrep(imageFile,file,id,false).then(data => {
                                          imgur.uploadImage(data ,id);
                                        })
                                       
                                        
                                    });
                                }
                                var productImage = req.files.image;
                                var path = 'public/product_images/' + id + "/" + imageFile;

                                productImage.mv(path, (err) => console.log(err))
                            }
                        })
                        req.flash('success', 'Product edited');
                        res.redirect('/admin/products/edit-product/' + id);

                    })

                }
            })
        }
    })

//post galleryimages
router.post('/product-gallery/:id', (req, res) => {
    var imageName = req.files.file.name
    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + imageName
    var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + imageName
     
    
    imgur.getAlbumID(id).then(data2 => {
        
        imgur.formDataPrep(imageName, productImage, id, true).then(data1 => {
            
           imgur.albumUpload(data1, data2)
        })
    })
    
    
    res.sendStatus(200);  
});


//delete galleryimages
router.get('/delete-image/:image&:p_id', isAdmin, (req, res) => {
    console.log(req.params)

    var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.p_id
    var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs' + req.params.p_id


    imgur.deleteGalleryImage(req.params.image)
   
    fse.remove(originalImage, (err) => {
        if (err) { console.log(err) }
        else {
            fse.remove(thumbImage, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    req.flash('success', 'Image deleted');
                    res.redirect('/admin/products/edit-product/' + req.params.p_id);
                }
            });
        }
    });
});




//get delete product
router.get('/delete-product/:id', isAdmin, (req, res) => {

    var id = req.params.id
    var path = 'public/product_images/' + id;

    fse.remove(path, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            imgur.deleteImage(id);
            imgur.deleteAlbum(id);
            Product.findByIdAndRemove(id, (err) => console.log(err));
            req.flash('success', 'Product deleted');
            res.redirect('/admin/products/');
        };
    });

});

//exports

module.exports = router

