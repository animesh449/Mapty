const mysql=require("mysql");
const con=mysql.createConnection({
    
        host:"localhost",
        user:'root',
        password:"",
        database:'workout'
    

});
module.exports=con;

