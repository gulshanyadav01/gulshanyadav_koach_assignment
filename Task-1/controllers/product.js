const Product = require("../model/Product"); 
const Seller = require("../model/Seller"); 

// create Product
// Post : method
// @ /api/add-product
// Desc : end point for creating the product 
exports.addProduct  = async (req, res) => {

    const { name, price, description, seller,  color} = req.body; 
     

    try{
        const product = new Product({
            name,
            price,
            description,
            seller,
            color
        }); 

        const  newSeller = await Seller.findOne({_id :seller});
         
        
        await product.save();
        newSeller.products.push(product); 
        await newSeller.save(); 
        // return res.json(seller);
        return res.json(product); 

    }catch(err){
        console.log(err); 
    }

}

// Get All Product 
// Get Method 
// @/api/get-products
// Get All Products 

exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find().populate('seller',["name","email","address"]); 

        if(!products){
            return res.json({message : "no product available"}); 
        }
        return res.json(products); 

    }catch(err){
        console.log(err); 
    }
}


// Get one  Product : 
// Get Method
// @/api/get-product/:id
// get product by id 
exports.getProductById = async (req, res) => {

    // get the product id which is pass in url. 
    
    try{

        const productId = req.params.id; 
        if(!productId){

            return res.json({message: "please provide correct url"}); 
        }

        const product = await Product.findOne({_id: productId}).populate("seller",["name", "email", "address"]);

        if(!product){
            return res.json({message: "product doesn't exist"}); 
        }
        return res.json(product);

    }catch(err){

        console.log(err);
    }

} 



// Update The Product
// put Method
// @/api/update-product/:id
// find the product by id and Update 



exports.updateProduct = async (req, res) =>{
    
    const {name, price, description, seller,  color} = req.body; 
    const productId = (req.params.id);
    
    
    // build profile object; 

    const productFields = {};
    productFields.name = name; 
    productFields.price = price; 
    productFields.description = description; 
    productFields.seller = seller; 
    productFields.color = color; 
    
    try{
        let product = await Product.findOne({_id:productId});
        
        if(product){
            // update 
            product = await Product.findOneAndUpdate({_id: productId}, {$set:productFields}, {new: true});
           return res.status(200).json(product); 
        }
        // create a new one 
        // profile = new Profile(profileFields); 
        // await profile.save(); 
        // return res.status(200).json(profile); 


    }catch(err) {
        console.log(err);
        return res.status(500).send("server error");
    }


}




