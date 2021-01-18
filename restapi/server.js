var http = require("http");
var {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require("./controllers/productcontroller")


const server = http.createServer((req,res) => {
    if(req.url ==="/api/products" && req.method === "GET" ) {
        getProducts(req, res);
    }else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "GET")
    {
      const id = req.url.split('/')[3]  
      getProduct(req, res, id)
    }else if(req.url.match(/\/api\/products\//) && req.method === "POST")
    {
        createProduct(req,res)
    }
    else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "PUT")
    {
      const id = req.url.split('/')[3];
      updateProduct(req, res, id);  
    }
    else if (req.url.match(/\/api\/products\/([0-9]+)/) && req.method === "DELETE")
    {
      const id = req.url.split('/')[3];
      deleteProduct(req, res, id);  
    }
    else{
        console.log(req.url);
        console.log(req.method);
        res.writeHead(404,{'Content-Type':"application/json"})
        res.end(JSON.stringify({message: "Route not found"  }))
    }
})
const port =process.env.port || 5000

server.listen(port,() => console.log(`Server running on port ${port}`));