const jwt = require("jsonwebtoken"); 
require("dotenv").config()


// While login is sucessful paste this code
// User information or claims to include in the token
const userClaims = {
  id: 123,
  username: 'exampleuser',
};

// Generate the JWT token
const gen_token = jwt.sign(userClaims, process.env.SECRET_KEY, { expiresIn: '1h' }); // Expires in 1 hour


const isSignedIn = async(req,res,next)=>{
    try {
        let token = req.headers.authorization
        if(token != undefined){
            let user = await jwt.verify(token,process.env.SECRET_KEY)
            req.userID = user.id
        }else{
            return res.status(401).json({ message: "User is unauthorized" })
        }
        next()
    } catch (error) {
        return res.status(400).json({ message: "Some error occured" ,msg: error.message})
    }
}

module.exports = isSignedIn