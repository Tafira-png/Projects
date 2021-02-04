//imgur client id 

var FormData = require('form-data');
const fetch = require('node-fetch');
var fse = require("fs-extra");

const Gallery = require("../models/gallery.js");
var Product = require("../models/product");

let imgurClient = "Client-ID 47b5931001fd958"

async function uploadImage(data, p_id) {
    try{
        const postImage = await fetch("https://api.imgur.com/3/upload", {
        method: "POST",
        headers: {
            Authorization: imgurClient
        },
        body: data
    })
    res = await postImage.json()
    console.log(res + "wheres my response")
    if (res) 
    {
        let deleteHash = res.data.deletehash
        let imgurId = res.data.id
        let imgurURL = res.data.link

        Product.findById(p_id, (err, product) => {
            if (err) return console.log(err)
            else {
                product.deleteHash = deleteHash
                product.imgurId = imgurId
                product.imgurURL = imgurURL
                product.save(err => {
                    if (err) console.log(err)
                    console.log("imgur properties saved to db")
                })
            }

        })

    }}
    catch(err){
        console.log(err)
    }

    
}

async function albumUpload(data, albumHash){
    console.log(data)

    try{
        const postImage = await fetch("https://api.imgur.com/3/upload",{
            method:"POST",
            headers: {
                Authorization: imgurClient
            },
            body:data
        })
        
       var data1 = await postImage.json()
       console.log(data1 + "in album upload")
       if(data1.status == 200 && data1.success == true )
        {
            console.log("image id:" + data1.data.id + "uploaded to imgur")
            var dataObj = new Gallery({
                imgurID : data1.data.id,
                imgurURL: data1.data.link,
                deleteHash : data1.data.deletehash,
                albumHash: albumHash
            })
            dataObj.save(err => console.log(err))
              console.log("gallery inserted.")
        } else throw("status:" + data.data.status + " An error has occurred." )

    }
    catch (err) {
        console.log(err)


    } 
}


async function deleteImage (productID) {
    var productHash = ""
    
    await Product.findById(productID, (err, product) => {
        if (err) console.log(err)
        productHash = product.deleteHash
        return productHash
    })

    let url = ("https://api.imgur.com/3/image/" + productHash)
    console.log(url)
     await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: imgurClient
        }
    }).then(res => {
            if (res.status !== 200 && res.success !== true ) {
                console.log("Images not deleted. Status code = " + res.status)
            } else {
                console.log("Imgur images deleted.")

            }
        }).catch (
            console.log('an error has occurred')
        )


}


 function deleteGalleryImage(param) {
     
    console.log(param)
    Gallery.findOneAndDelete(({imgurID: param}), (err, res) => {
        console.log(err)
        console.log(res)
         deleteHash = res.deleteHash
        console.log(deleteHash + "this is deletehash")  
        let url = ("https://api.imgur.com/3/image/" + deleteHash)
    console.log(url)
      fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: imgurClient
        }
    }).then(res => {
            if (res.status !== 200) {
                console.log("Images not deleted. Status code = " + res.status)
            } else {
                console.log("Imgur images deleted.")

            }
        }).catch (
            console.log('an error has occurred')
        )
    })
}

async function deleteAlbum(productID) {
    var albumHash = ""
    
    await Product.findById(productID, (err, product) => {
        if (err) console.log(err)
        albumHash = product.AlbumHash
        return albumHash
    })

    let url = ("https://api.imgur.com/3/album/" + albumHash)
    console.log(url)
     await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: imgurClient
        }
    }).then(res => {
            if (res.status !== "200") {
                console.log("Album not deleted. Status code = " + res.status)
            } else {
                console.log("Imgur album deleted.")

            }
        }).catch (
            console.log('an error has occurred')
        )


}

async function formDataPrep(imageFileName, image, db_id, isGallery) {

    if (imageFileName != "") {
        var album = null
        var result = null
        if(isGallery) {
          album  = await getAlbumHash(db_id)
         var path = 'public/product_images/' + db_id + "/gallery/" + imageFileName;}
         else {
          var path = 'public/product_images/' + db_id + "/" + imageFileName;
         }
        if(album) result =  await album
        console.log(result + "big poop")
        console.log(path)
        let formData =  new FormData();    

        await image.mv(path, (err) => console.log(err))
        formData.append('image', fse.createReadStream(path))
        if(result) {formData.append('album', result)}
        console.log(formData + "this is formdata")
        return formData
    }
}

 async function getAlbumHash (productID) {
    let album = await Product.findById(productID).exec()  
    res = album.toJSON()
    // console.log(res.AlbumHash);
    value = res.AlbumHash
    return value

}
async function getAlbumID (productID) {
    let album = await Product.findById(productID).exec()  
    res = album.toJSON()
    value = res.AlbumID
    return value

}

async function albumCreate(productID) {
   
   const album = await fetch("https://api.imgur.com/3/album",
    {
        method: "POST",
        headers: {
            Authorization: imgurClient
        }
    })
    res = await album.json();
    console.log(res)
    if (res) {
        let albumID = res.data.id
        let albumHash = res.data.deletehash
        Product.findById(productID, (err, product) => {
            if (err) return console.log(err)
            else {
                product.AlbumID = albumID
                product.AlbumHash = albumHash
                product.save(err => {
                    if (err) console.log(err)
                    console.log("album properties saved to db")
                })
            }

        })
    }
}

async function fetchAlbumImages(AlbumID) {
    let dataArray = []
      const album = await fetch("https://api.imgur.com/3/album/" + AlbumID + "/images",
    {
        method: "GET",
        headers: {
            Authorization: imgurClient
        }
    })
    var res = await album.json()
   
    if(res) {
       dataArray = res.data
       
       console.log("returning dataArray")
       return dataArray
   }
}

    



module.exports = {
    uploadImage,
    albumCreate,
    albumUpload,
    deleteImage,
    deleteAlbum,
    deleteGalleryImage,
    fetchAlbumImages,
    getAlbumHash,
    getAlbumID,
    formDataPrep,
    
}