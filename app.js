// including the dependancies
const express=require('express');
const app=express();
const path=require("path");
const bodyParser=require("body-parser");
const mysql=require("mysql");
const session=require("express-session");
const { response } = require('express');
const mustacheExpress=require("mustache-express");
const {v4:uuidv4}=require("uuid");
const nodemailer=require("nodemailer");
const router=require("./routes.js");
app.use(router)

//setting up email
/*var transporter=nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "trackit.890@gmail.com",
        pass:"trackit@123"
    }
});
//setting up mail options
/*var mailOptions={
    from:"trackit.890@gmail.com"
    to:
    subject:"Welcome to Track-IT"
    text:"Thanks You for registering with us "
};*/

//setting up mustache template engine
app.engine("html",mustacheExpress());
app.set('view engine','html')
app.set("views",path.join(__dirname,"views"));
//setting up express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//setting static folders
app.use(express.static(path.join(__dirname,"HTML")));
app.use(express.static(path.join(__dirname,"Script")));
app.use(express.static(path.join(__dirname,"Images")));
app.use(express.static(path.join(__dirname,"CSS")));
app.use(bodyParser.urlencoded(
    {
        extended:true
    }
));
//homepage

//app
//user form
 /*var mail=req.body.email;
 var mailOptions={
    from:"trackit.890@gmail.com",
    to: mail,
    subject:"Welcome to Track-IT",
    text:"Thanks You for registering with us "
}

 transporter.sendMail(mailOptions,(err,info)=>{
     if(err) throw err
     console.log("Email has been sent to the registered User");
 })*/
//check if username exist if yes then log in the app


//server listening to port
app.listen(3000,function()
{
    console.log("server started running");
})