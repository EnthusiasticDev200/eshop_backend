import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"



import authorizedOrigin from "./config/cors.js"
import appRoutes from "./routes/routes.js"

dotenv.config()

const app = express()

const server = http.createServer(app)



app.use(express.json())
app.use(cors({
    origin : function(origin, callback){
            if ( !origin || authorizedOrigin.includes(origin)){
                return callback(null, true)
            }else{
                return callback(new Error("URL not permitted"))
            }
        },
    methods : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials : true
}))

app.use('/api', appRoutes)

const PORT = process.env.APP_PORT


server.listen(PORT, ()=>{
    console.log(`Backend server running on http://localhost:${PORT}`)
})


