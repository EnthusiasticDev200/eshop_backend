import { MongoClient } from "mongodb"
import dotenv from "dotenv"


dotenv.config()

let db = null
let client = null

export async function connectDb(){
    const dbName = process.env.NODE_ENV === 'development'
        ? process.env.ENV_DB_NAME 
        : process.env.PROD_DB_NAME 

    const uri = process.env.NODE_ENV ==='development'
        ? process.env.ENV_MONGODB_STRING
        : process.env.PROD_MONGO_STRING
    try{
        if (!client){
            client = new MongoClient(uri)
            await client.connect()
            console.log("DB connected successfully")
        }
        if(!db){
            db = client.db(dbName)
            console.log("using database", dbName)
        }
        return db
    }catch(error){
        console.error("DB connection failed", error)
    }
    
}


// create collection
export async function productCollection(){
    const database = await connectDb()
    return database.collection('products')
}

