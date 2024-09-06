const express = require("express")
// const app = express();
const jwt = require("jsonwebtoken")
const JWT_SECRET = require("../config");
const { User } = require("../db");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).send({error: "Authorization header missing."});
    }

    const jwtToken = authHeader.split(' ')[1];
    if(!jwtToken){
        return res.status(401).send({error: "Authorization token missing."});
    }
    
    // console.log(jwtToken);

    jwt.verify(jwtToken,JWT_SECRET,(err,decoded)=>{
        if(err){
            console.error("JWT Verification Error:",err.message);
            return res.status(403).send({error:"Invalid Token. Access denied"})
        }
        req.user = {
            userId: decoded.userId,
            username: decoded.username

        };
        next();
        
    });

};   

module.exports = authMiddleware;