const express=require("express")
const router=express.Router()
router.get("/hello",(req,res)=>{
    res.send("Successfully imported");
})
module.exports=router