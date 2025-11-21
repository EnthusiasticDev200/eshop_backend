import { Product } from "../models/products/products.js";
import cloudinary from "../config/cloudinary.js"
import fs from "fs"

export const createProductImageUrl = async ( req, res )=>{
    try{
        const imagePath = req.file.path

        // image size 
        // if (req.file.size > 28229){
        //     return res.status(400).json({
        //         message : "file too large"})
        // }
        if ( !req.file ) return res.status(404).json({
            message : "image file not found"
        })
        const options = {
            use_filename : true,
            unique_filename : true,
            overwrite : true
        }
        const uploadImage = await cloudinary.uploader.upload(
            imagePath, options)
        
        const imageUrl = uploadImage.secure_url
        
        // remove image stored local temp file {dest: upload/}
        fs.unlinkSync(req.file.path);

        return res.status(201).json(imageUrl)
    }catch(error){
        console.log("Error uploading image",error.stack)
        return res.status(500).json({
            message : "image upload failed",
            error : error.stack
        })
    }
}




export const createProduct = async( req, res )=>{
    try{
        const { title, price, imageUrl } = req.body
        // const { image } = req.file

        if ( !title || !price || !imageUrl){
            return res.status(400).json({message : "all fields required"})
        }
        // check existing product
        const existingProduct = await Product.findOne(title)

        if(existingProduct){
            return res.status(409).json({
                message : "product already exist"
            })
        }
        //create new
        const product = await Product.create(req.body)
        return res.status(201).json({
            message : "product created!",
            product : product
        })
    }catch(error){
        console.log("Error creating product", error)
        return res.status(500).json({
            message : "Error creating product",
            error : error.stack
        })
    }
}

export const getProduct = async( req, res ) =>{
    try{
        const { id } = req.params
        let product
        try{
            product = await Product.findOne(id)

        }catch(error){
            return res.status(400).json({
                error : error.message
            })
        }
        return product 
        ? res.status(200).json(product) 
        : res.status(404).json({message : "product not found"}) 

    }catch(error){
        console.log("Error getting product", error)
        return res.status(500).json({
            message : "Error getting product",
            error : error.stack
        })
    }
}

export const searchProductByTitle = async( req, res ) =>{
    try{
        const { title } = req.query

        if (!title) {
            return res.status(400).json({ message: "Title query is required" });
        }
        const product = await Product.findOne(title)
       
        return product 
        ? res.status(200).json(product)
        : res.status(404).json({message : "Product not found"})

    }catch(error){
        console.log("Error getting searched product", error)
        return res.status(500).json({
            message : "Error getting searched product",
            error : error.stack
        })
    }
}



export const getAllProduct = async ( req, res )=>{
    try{

        const allProducts = await Product.findAll()
        return res.status(200).json(allProducts)

    }catch(error){
         console.log("Error getting all product", error)
        return res.status(500).json({
            message : "Error getting all product",
            error : error.stack
        })
    }
}


export const deleteProduct = async( req, res )=>{
    try{
        const { id } = req.params
        try{
            const existingProduct = await Product.findOne(id)
            
            if(!existingProduct){
                return res.status(404).json({
                    message : "product not found or already deleted"
                })
            }
        }catch(error){
            return res.status(400).json({
                error : error.message
            })
        }
       //delete account
        await Product.delete(id)
        return res.status(200).json({message : "product deleted successfully"})
    }catch(error){
        console.log("Error deleting product", error)
        return res.status(500).json({
            message : "Error deleting message",
            error : error.message
        })
    }
}

export const updateProduct = async ( req, res )=>{
    try{
        const { id } = req.params
        const { title, price, imageUrl } = req.body

        const updateData = await Product.update(id, req.body)
        
        return res.status(201).json({
            message : "product updated successfully",
            product : updateData
        })
    }catch(error){
       console.log("Error updating product", error)
        return res.status(500).json({
            message : "Error updating message",
            error : error.message
        }) 
    }
}