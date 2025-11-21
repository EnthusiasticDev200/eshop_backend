import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv"


dotenv.config()

let db = null
let client = null

export async function connectDb(){
    if( process.env.NODE_ENV === 'development'){
        const dbName = process.env.ENV_DB_NAME
        const uri = process.env.ENV_MONGODB_STRING

        try{
            if( !client){
                client = new MongoClient(uri)
                await client.connect()
                console.log("DB connected to dev successfully")
            }
            if ( !db ){
                db = client.db(dbName)
            }
            return db
        }catch(error){
            console.log("error connecting to DB", error.stack)
        }
    }else{
        const dbName = process.env.PROD_DB_NAME
        console.log("dbName", dbName)

        const uri = process.env.PROD_MONGODB_STRING

        console.log('uri', uri)
        try{
            if( !client ){
                client = new MongoClient(uri, {
                    tls: true,
                    tlsAllowInvalidCertificates: false,
                    serverApi: ServerApiVersion.v1
                })
                await client.connect()
                console.log("DB connected to prod successfully")
            }
            if ( !db ){
                db = client.db(dbName)
                console.log("using database ", db)
                await db.command({ ping: 1 }); //test if connection oggd
                console.log("Pinged Atlas successfully");
            }
            return db
        }catch(error){
            console.log("error connecting to prod instance", error.stack)
        }
    }
}

// export async function connectDb(){
//     const dbName = process.env.NODE_ENV === 'development'
//         ? process.env.ENV_DB_NAME 
//         : process.env.PROD_DB_NAME 

//     const uri = process.env.NODE_ENV ==='development'
//         ? process.env.ENV_MONGODB_STRING
//         : process.env.PROD_MONGO_STRING
//     try{
//         if (!client){
//             client = new MongoClient(uri)
//             await client.connect()
//             console.log("DB connected successfully")
//         }
//         if(!db){
//             db = client.db(dbName)
//             console.log("using database", dbName)
//         }
//         return db
//     }catch(error){
//         console.error("DB connection failed", error)
//     }
    
// }


// create collection
export async function productCollection(){
    const database = await connectDb()
    return database.collection('products')
}

