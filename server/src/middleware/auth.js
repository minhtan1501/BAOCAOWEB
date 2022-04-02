const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if(!token) return res.status(400).json({message: "Invalid Authentication"});
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,data)=>{
        if(err) return res.status(400).json({message:"Invalid Authentication"});
        req.user = data
        next();
    })  

}

module.exports = auth;