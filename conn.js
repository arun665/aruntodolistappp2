const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost:27017/youtuberegistration",{useNewUrlParser:true , useUnifiedTopology:true,useFindAndModify:false})
.then(function(){
    console.log(" this is running successfully");
})
.catch(function(error){
    console.log(error);

});




