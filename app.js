var express= require('express');
const { json } = require('express/lib/response');
var app= express();
var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
const port = process.env.port|| 3004
var fs = require('fs')

var currentSearchResult = 'example'




app.get('/', (req, res) => {
res.sendFile(__dirname+'/register.html');
})
app.post("/register",function(req,res){
    console.log(req.body);
   
    var username=req.body.username;
    var useremail=req.body.useremail;
    var userpassword=req.body.userpassword;

    var obj = {
        userdata: []
     }; 
     fs.readFile('data.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
           
        obj = JSON.parse(data); //now it an object
        obj.userdata.push({username: username, useremail:useremail,userpassword:userpassword}); //add some data
        
        result = JSON.stringify(obj,null,2); //convert it back to json
        console.log("obj"+json);
        fs.writeFile("data.json", result, function(err) {
            if (err) throw err;
            res.json({message:"SUCCESS"});
            }
        );
    }});
    
})

app.get("/login",(req,res)=>{
 res.sendFile(__dirname+'/login.html');
})
app.post("/validatelogiin",(req,res)=>{
    var username=req.body.useremail;
    var userpassword=req.body.userpassword;
    resdata=false;
    fs.readFile("data.json",function(err,data){
      //  console.log("==>"+data);
       var result=JSON.parse(data);
       
       var finaldata=result['userdata'].filter(obj=> (obj.username ==username && obj.userpassword ==userpassword));
       if (finaldata.length === 0) { 
             //res.json({message:'error'});
             res.redirect("/login")
        }
        else{
               res.cookie('username',finaldata[0].username);
               res.redirect('/manageTask');
              
        }
    })

})
var validate = function(req,res,next){
    console.log("MIddle middle function called");
    if(req.cookies.username)
    {
        console.log("cookie received"+req.cookies.username);
        next();
    }
    else{
        res.redirect("/login")
    }
}

app.use(validate);
var todolist=['Food','Bazar','Fule'];

app.get('/manageTask',function(req,res){
    res.sendFile(__dirname+'/home.html');
})

app.get('/loadtask',function(req,res){
    res.json(todolist)
})
app.post("/addTask",(req,res)=>{
      console.log("req.body",req.body)
      todolist.push(req.body.task);
      res.json({message:'SUCCESS'})
   
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})