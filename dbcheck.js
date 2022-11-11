var sql=require("./db.js")
sql.query("SELECT * FROM registration",function(err,rows){
    if (err) throw err
    console.log(rows[1].ID);
});