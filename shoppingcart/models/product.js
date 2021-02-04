var mongoose = require('mongoose');

// Product Schema

var ProductSchema = mongoose.Schema({

    title:{
        type:String,
        required: true
    },
    slug:{
        type:String,
        
    },
    desc:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        
    },
    imgurId: {
        type:String,
    },
    imgurURL: {
        type:String
    },
    deleteHash: {
        type:String
    },
    AlbumID: {
        type: String
    },
    AlbumHash: {
        type: String
    }

});

var Product = module.exports = mongoose.model('Product', ProductSchema);
