import { ObjectId } from "mongodb";
import { productCollection } from "../../config/database.js";

class ProductData{
    id;
    title;
    price;
    imageUrl;  
    createdAt;
    updatedAt;
}
export class Product extends ProductData{
    constructor(payload){
        super()
        this.id = payload.id
        this.title = payload.title
        this.price = payload.price
        this.imageUrl = payload.imageUrl
        this.createdAt = payload.createdAt
    }

    // create method
    static async create(payload){
        const collection = await productCollection() // create product collection

        const product = new Product(payload)

        console.log("product creation", product)
        
        const createProduct = await collection.insertOne({
            _id : new ObjectId(),
            title : product.title,
            price : product.price,
            imageUrl : product.imageUrl,
            createdAt : new Date ()
        })
        return createProduct
    }

    // get method either by id or title
    static async findOne(value){

        const collection = await productCollection()

        // if valid id
        if( ObjectId.isValid(value) ){
            const response = await collection.findOne({
                _id : new ObjectId(value)
            })
            return response ? response : null
        }
        // if string
        if( typeof value === "string" ){
            console.log("from search",value, typeof value)
            const response = await collection.findOne({title: value})

            console.log("response from get method", response)
            return response ? response : null

        }
        // if none
        throw new Error("Input neither a valid ObjectId or string")
       
    }

    //find all
    static async findAll(){
        const collection = await productCollection()

        const products = await collection.find().toArray()
        if (!products) throw new Error("cannot get product")

        return products ? products : null
    }

    // delete method

    static async delete(id){
        const collection = await productCollection()
        const isValidId = ObjectId.isValid(id)
        if(!isValidId) throw new Error("invalid id")
            
        const doc = await collection.deleteOne({_id : new ObjectId(id)})
        return doc.deletedAccount > 0
    }

    // update method
    static async update(id, payload){
        const collection = await productCollection()
        const isValid = ObjectId.isValid(id)
        if( !isValid ) throw new Error("Invslid id")
        
        payload.updatedAt = new Date() // bring in updateedAt
        const updated = await collection.updateOne(
            {_id : new ObjectId(id)},
            {$set : payload}
        )
        return updated
        //updated.modifiedAccount > 0
    }

}





