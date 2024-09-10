const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/taskDB")
.then(()=>{
    console.log("taskDB connected to database")
})
.catch(()=>{
    console.log("failed to connect");
})

const userLoginSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const userLoginCollection=new mongoose.model("users",userLoginSchema)

module.exports=userLoginCollection
