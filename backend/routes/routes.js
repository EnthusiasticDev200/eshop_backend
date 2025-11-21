import express from "express"

import { 
    createProduct, createProductImageUrl, deleteProduct, 
    getAllProduct, getProduct, searchProductByTitle, updateProduct 
} from "../controller/product.js"

import multer from "multer"

// create upload file and store the images there
const upload = multer({ dest : "uploads/"})  

const router = express.Router()




// create product image url
router.post("/product/create/imageurl", upload.single("file"), createProductImageUrl)

//product route
router.post("/product/create", createProduct)

router.get("/product/:id", getProduct)

router.get("/product", searchProductByTitle)

router.get("/products", getAllProduct)

router.delete("/product/:id", deleteProduct)

router.patch("/product/:id/update", updateProduct)





export default router

