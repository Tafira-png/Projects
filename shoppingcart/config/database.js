const mongoURI = process.env.MONGODB_URI
console.log(mongoURI);
module.exports =  { 
    database: mongoURI
    // database: 'mongodb://localhost/s_cart'
   
}  