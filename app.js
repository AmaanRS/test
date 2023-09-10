const express = require('express')
const cors = require('cors')
const  isSignedIn  = require('./middlewares/middleware')
const router = require('./routes/Router')
const connectDB = require("./db/connect")
const path = require('path');
const app = express()
require("dotenv").config()

//Template engine
app.set('view engine', 'ejs');

//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());



//Serve html templates
app.set('views', path.join(__dirname, 'public/Templates'));

// Serve static files (e.g., CSS, images)
app.use('/static',express.static(path.join(__dirname, 'public')));



//Routes
app.use('/',router)


app.get("/",(req,res)=>{
    res.render('index')
})


const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI).then(console.log("Database Connected"))
        app.listen(3000,console.log("Listening to port 3000"))
    } catch (error) {
        console.log(error)
    }
}
start()
