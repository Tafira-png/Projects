var mongoose = require('mongoose');

// Gallery Schema

var GallerySchema = mongoose.Schema({

    imgurID :{
        type:String,
        required: true
    },
    imgurURL:{
        type:String,
        
    },
    deleteHash :{
        type:String,
        required: true
    },
    albumHash :{
        type: String
       
    },
   


});

var Gallery = module.exports = mongoose.model('gallery', GallerySchema);