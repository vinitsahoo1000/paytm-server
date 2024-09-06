const express = require("express");
const {UserZod,signin,update} = require("../InputSchema/userSchema")
const {User,Account} = require("../db")
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config")
const authMiddleware = require("../middleware/middleware")
const bcrypt = require('bcrypt');


router.post("/signup", async(req,res)=>{
    
    try{
        const parsedData = UserZod.parse(req.body);
        
        const existingUser = await User.findOne({username: parsedData.username});
        if(existingUser){
            return res.status(411).send({error: "Email already taken/Incorrect Input"});
        }

        const hashedPassword = await bcrypt.hash(parsedData.password,12);
        const newUser = new User({...parsedData,password:hashedPassword});
        await newUser.save();
        const userId = newUser._id;

        // console.log(userId);

        await Account.create({
            userId,
            balance: 1+ Math.random() * 10000
        })

        const jwtToken = jwt.sign({username: parsedData.username,userId: newUser._id},JWT_SECRET);
        res.status(200).send({message: "User Signed up successfully", token: jwtToken });

    }catch(e){
        if(e.errors){
            res.status(500).send({error: "Invalid Input", details: e.errors});
        }else{
            res.status(500).send({error: 'An error occurred', details: e.message});
        }
    }
});

router.post("/signin",async(req,res)=>{
    try{
        console.log("signin endpoint hit")
        const loginData = signin.parse(req.body);

        

        const existingUser = await User.findOne({username: loginData.username});
        if(existingUser){
            const isMatch = await bcrypt.compare(loginData.password,existingUser.password)

            if(!isMatch){
                return res.status(401).send({
                    msg: "Invalid Password."
                })
            }
            const token = jwt.sign({username: loginData.username,userId: existingUser._id}, JWT_SECRET);
            return res.status(200).send({
                token: token
            })
        }else{
            return res.status(401).send({msg:"user not found"})
        }


    }catch(e){
        if(e.errors){
            res.status(411).send("Error while logging in")
        }
    }
})

router.get("/gate",authMiddleware,(req,res)=>{

    res.status(200).send({
        msg: "User Verified",
        // user: req.user
    })

})

router.put("/update",authMiddleware,async(req,res)=>{

    try{
    const updateData = update.parse(req.body);
    
    if(updateData.password){
        const hashedPassword = await bcrypt.hash(updateData.password,12);
        updateData.password = hashedPassword;
    }

    const updateUser = await User.findOneAndUpdate({username: req.user.username},updateData, {new:true});

    console.log(updateUser);

    if(!updateUser){
        return res.status(404).send({
            msg: "User not found"
        })
    }
    console.log(`${req.user.username} updated successfully.`)

    res.status(200).send(`${req.user.username} User Updated successfully`)
    }catch(error){
        console.error("Error updating user: ",error.message);

        res.status(500).send("An error occured while updating user.")
    }
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex":filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })


    res.json({
        user : users.map(user =>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;