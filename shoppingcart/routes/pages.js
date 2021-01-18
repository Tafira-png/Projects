var express = require("express");
var router = express.Router();
const Page = require("../models/page")

//get /
router.get('/', (req,res) => 
Page.findOne({title:"Home"}, (err, page) =>{
    if(err) console.log(err);
    res.render('index',{
        title:   page.title,
        content: page.content
    });
}));

        
   

//get all other page routes
router.get('/:slug', (req,res) =>  {
    var slug = req.params.slug;

    Page.findOne({slug: slug}, (err, page) =>{
        if(err) console.log(err);

        if(!page) {
            res.redirect('/')
        } else {
            res.render('index',{
                title: page.title,
                content: page.content,

            })
        }
    })
});


//exports

module.exports = router


