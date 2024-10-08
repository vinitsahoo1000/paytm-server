const express = require('express');
const authMiddleware = require('../middleware/middleware');
const { User,Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance",authMiddleware,async (req,res)=>{
    try{
    const account = await Account.findOne({
        userId: req.user.userId
    });

    if(!account){
        return res.status(404).json({
            message: "Account not found"
        })
    }

    res.json({
        balance: account.balance
    })

}catch(error){
    console.error("Error fetching balance:", error);
    res.status(500).json({ message: "Internal server error" });
}
})

router.post("/transfer",authMiddleware,async(req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();

    const {amount,to} = req.body;

    const account = await Account.findOne({
        userId: req.user.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();

        res.status(400).json({
            message: "Insufficient balance."
        });
    }

    const toAccount = await Account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account"
        });
    }

    await Account.updateOne({ userId: req.user.userId }, {$inc: {balance: -amount}}).session(session);
    await Account.updateOne({ userId: to }, {$inc: {balance: amount}}).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });

});

module.exports = router