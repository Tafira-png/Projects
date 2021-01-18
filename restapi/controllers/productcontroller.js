const Product = require("../models/modelsProduct")
const {getPostData} = require('../utils')

//gets all products
// get /api/products
async function getProducts(req,res) {
    try{
        const products = await Product.findAll();
        res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(products));
    }
    catch(err) {
        console.log(err)
    }
}

//gets single product
// gets /api/product/:id
async function getProduct(req,res, id) {
    
    try{
        const product = await Product.findByID(id);
        
        if(!product){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({ message: 'Product not found'}));
        }
        else{
            res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify(product));

        }
        
    }
    catch(err) {
        console.log(err)
    }
}

//creat product post
async function createProduct(req,res) {
    try{
        const body = await getPostData(req);

        const {name,description,price} = JSON.parse(body);

        const product = {
            name,  
            description, 
            price    
        }
        const newProduct = await Product.create(product);
        res.writeHead(201,{'Content-Type':'application/json '})
        return res.end(JSON.stringify(newProduct))

             
    }
    catch(err) {
        console.log(err)
    }
}

//update product put
async function updateProduct(req,res, id) {
    try{
        const product = await Product.findByID(id)
        if(!product)
        {
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({ message: 'Product not found'}));
        }
        else 
        {
            const body = await getPostData(req);

            const {name,description,price} = JSON.parse(body);
    
            const productData = {
                name: name || product.name,  
                description: description || product.description, 
                price: price || product.price
            }
            const updProduct = await Product.update(id, productData);
            res.writeHead(200,{'Content-Type':'application/json '})
            return res.end(JSON.stringify(updProduct))
        }          
    }
    catch(err) {
        console.log(err)
    }
}
//delete product delete 
async function deleteProduct(req,res, id) {
    
    try{
        const product = await Product.findByID(id);
        
        if(!product){
            res.writeHead(404,{'Content-Type':"application/json"});
            res.end(JSON.stringify({ message: 'Product not found'}));
        }
        else{
            await Product.remove(id)
            res.writeHead(200,{'Content-Type':"application/json"});
        res.end(JSON.stringify({message:`Product ${id} removed`}));

        }
        
    }
    catch(err) {
        console.log(err)
    }
}

module.exports ={
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}