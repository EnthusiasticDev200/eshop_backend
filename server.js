import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"



import authorizedOrigin from "./backend/config/cors.js"
import appRoutes from "./backend/routes/routes.js"

dotenv.config()

const app = express()

const server = http.createServer(app)

app.set("trust proxy", 1)

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

app.get("/healthz", (req, res) => res.send("OK"));

server.listen(PORT, ()=>{
    console.log(`Backend server running on http://localhost:${PORT}`)
})


app.get('/', ( req, res )=>{
    res.send("Welcome to EshopBackend")
})

app.use('',(req, res)=>{
    return res.status(404).json({
        message : "Route not found"
    })
})
