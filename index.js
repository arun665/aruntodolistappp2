const mongoose=require('mongoose');
const express=require("express");
const bodyparser=require("body-parser");

const port=3000;
const path=require("path");
const {json} = require("express");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

mongoose.connect("mongodb+srv://mongodb:Arun1117@cluster0.spwl1.mongodb.net/mongodb?retryWrites=true&w=majority",{useNewUrlParser:true , useUnifiedTopology:true,useFindAndModify:false})
.then(function(){
    console.log(" this is running successfully");
})
.catch(function(error){
    console.log(error);

});

const playlist=new mongoose.Schema({
    email:{
        type:String,
  
    },
    password:{
        type:String,

    },
    task:{
        type:String,
        unique:false,
        sparse:true
       
        
    },
    time:{
        type:String
    },
    status:{
        type:String
    }
});

const Temp=new mongoose.model("Temp",playlist);


const static_path=path.join(__dirname,"/public");

const app=express();
app.use(express.static(static_path));
app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyparser.urlencoded({extended:true}));




app.get("/", function(req,res){

    if( localStorage.getItem("email") !== null){
        res.redirect("/addtask");
    }

    res.render("index.ejs",{error:""});

})




app.post("/register",async function(req,res){
try{
    console.log(req.body.newemail);

   var result=await Temp.find();
var r=false;
var index=-1;

    for(var i=0;i<result.length;i++){
        if(result[i].email===req.body.newemail){
            r=true;
            index=i;
            break;
        }
    
    }

    if(r===true){
        res.render("signup.ejs",{error:"this email already exist , please signin"});

    }
else{
    localStorage.setItem("email",req.body.newemail);
    localStorage.setItem("password",req.body.newpassword);
    const employee=new Temp({
        email:req.body.newemail,
        password:req.body.newpassword
        

       })

       employee.save(function(err,res1){
           if(err){
               res.send(err);
           }

           res.redirect("/addtask");
       });
  
    }
}
    catch(error){
        res.send(error);
    }
    });

app.get("/signin",function(req,res){
    res.render("signin.ejs",{error:""});
})

app.get("/signup",function(req,res){
    res.render("signup.ejs",{error:""});

})

app.post("/signin",async function(req,res){
try{
    var email=req.body.email;
    var password=req.body.password;

    localStorage.setItem("email",req.body.email);
    localStorage.setItem("password",req.body.password);
    
    var result=await Temp.find();
var r=false;
var index=-1;

    for(var i=0;i<result.length;i++){
        if(result[i].email===email){
            r=true;
            index=i;
            break;
        }
    
    }



    if(r==true){

        if(password === result[index].password){
            res.redirect("/addtask");
        }
        else{
            res.render("signin.ejs",{error:"Wrong password"});
        }

    }
    else{
        res.render("signin.ejs",{error:"this email does not exist"});
        
    }

}
catch(err){
    res.send(err);
}



});

app.get("/logout",function(req,res){
    
    localStorage.removeItem("email");
    localStorage.removeItem("password");

    res.redirect("/");

    
})
        
app.get("/addtask",async function(req,res){

    if( localStorage.getItem("email") === null){
        res.redirect("/");
    }

    const result=await Temp.find({email:localStorage.email});

    res.render("demo.ejs",{datas:result});
          
})

app.get("/deletetask/:id", async function(req,res){
try{
    if(localStorage.getItem("email")===null){
        res.redirect("/");
    }

    const _id=req.params.id;
    console.log(_id);

            const result= await Temp.deleteOne({_id},function(err,res1){

                res.redirect("/addtask");
            });

        
}
catch(error){
    res.send(error);
}
})


app.get("/donetask/:id", async function(req,res){
    try{
        if(localStorage.getItem("email")===null){
            res.redirect("/");
        }
    
        
        const _id=req.params.id;
        console.log(_id);
    
                const result= await Temp.updateOne({_id},{
                   $set: {status:"Completed"}

                },function(err,res1){
    if(err){
        res.send(err);
    }
    console.log("done task");
                    res.redirect("/addtask");

                });
    
            
    }
    catch(error){
        res.send(error);
    }
    })
    


    app.post("/addtask", async function(req,res){
        try{
        
            if(localStorage.getItem("email"===null)){
                res.redirect("/");
            }
        
            if(req.body.task!=""){
            var employee=new Temp({
                email:localStorage.email,
                password:localStorage.password,
             task:req.body.task,
             time:req.body.time,
             status:"incomplete"
               })
        
        
            
         
          employee.save(function(err,res1){
              if(err){
                  res.send(err);
              }

              console.log(" added successfully");
          });

          const result=await Temp.find({email:localStorage.email});
        
    
          res.render("demo.ejs",{datas:result});
                         
                  
        
        }
        else{
            res.render("demo.ejs",{datas:[]});
        }
        
            }
            catch(error){
                res.send(error);
        
            }
        
        })
        
        


app.listen(8000);



