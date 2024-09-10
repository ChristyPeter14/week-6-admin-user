var express = require('express');
var router = express.Router();
var app = express()
const session = require('express-session')
const userLoginCollection = require('../config/userDB');
const { Collection } = require('mongoose');
const bcrypt = require('bcrypt')



const userVerify=(req,res,next)=>{
  console.log(req.session.user);
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
}
router.get('/',async (req,res,next)=>{
  if(req.session.user){
    res.redirect('/home')
  }else{
    if(req.session.passwordwrong){
      res.render('user/login',{msg:"invalid credentials"})
        req.session.passwordwrong=false
      
    }
    else{
      res.render('user/login')
    }
  }
});






/*get login page*/

// router.get('/login', (req, res) => {
//   res.render('user/login')
// })



router.post('/login', async (req, res,next) => {
  try {
    const check = await userLoginCollection.findOne({ email: req.body.email })
    if (!check) {
      res.render('user/login', { msg: "your name cannot be found" })
    }
    // comparing hashed password
    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
    if (isPasswordMatch) {
     
      req.session.user=req.body.email

      res.redirect('/')
    } else {
      req.session.passwordwrong=true
      // res.redirect('/')
      res.render('user/login', { msg: "wrong Password" })
    }
  } catch {
    req.session.passwordwrong=true
    // res.redirect('/')
    res.render('user/login/', { msg: "wrong details" })

  }
})


// router.post('/login',async(req,res,next)=>{
//   console.log(req.body);
//   try{
//     const check=await userLoginCollection.findOne({email:req.body.email})
//     console.log(check);
//     if(check.password===req.body.password){
//       req.session.user=req.body.email
//       res.redirect('/home')
//       client=req.body
//     }
//     else{
//       req.session.passwordwrong=true
//       res.redirect('/')
//     }
//   }
//   catch{
//     req.session.passwordwrong=true
//     res.redirect('/')
//   }
// })



router.get('/signup', (req, res,next) => {
  res.render('user/signup')
})

/*get signup page*/
router.post('/signup', async (req, res,next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }
  const userExists = await userLoginCollection.findOne({ email: data.email })
  if (userExists) {
    res.render('user/signup', { msg: "email exists.Try another" })

  } else {
    // password hashing using bcrypt
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds)

    // replacing the original password 
    data.password = hashPassword;
    const userdata = await userLoginCollection.insertMany(data)
    console.log(userdata);
    res.redirect('/')

  }



})


// router.post('/signup',async(req,res,next)=>{
//   console.log(req.body);
//   const data={
//     name:req.body.name,
//     email:req.body.email,
//     password:req.body.password
//   }
//   await userLoginCollection.insertMany([data])
//   res.redirect('/')
// })





/* GET home page. */
router.get('/home',userVerify, function (req, res, next) {


  let products = [
    {
      name: "HP Laptop",
      category: "Laptops",
      description: " renovote your job",
      image: '/images/hp.jpeg',
      price: '65000'
    },
    {
      name: "Asus Laptop",
      category: "Laptops",
      description: " renovote your job",
      image: '/images/asus.jpeg',
      price: '75000'
    },
    {
      name: "Dell Laptop",
      category: "Laptops",
      description: " renovote your job",
      image: '/images/dell.jpeg',
      price: '65000'
    },
    {
      name: "Macbook Laptop",
      category: "Laptops",
      description: " renovote your job",
      image: '/images/mac.jpeg',
      price: '65000'
    }
  ]
   user=req.session.user
  res.render('user/index', { products,user,admin:false});
});

router.get('/logout',function(req,res,next){
  req.session.destroy()
  res.redirect('/')

})

module.exports = router;
