const router = require('express').Router();
const {validateUser} = require('../middleware/validator');
const User  = require('../model/user');
const auth = require('../middleware/auth');


// user Signup route
router.post('/signup',validateUser,async(req,res)=>{
          const user = new  User(req.body);
          try{
              await user.save();
              return res.status(201).json({msg : 'User Created' ,user});
          }catch(e){
              if(e.keyValue && e.keyValue.username) return res.status(500).json({Error :'Choose other Usename'});
               res.status(500).send(e);
          }


})

//user Login
router.post('/login', validateUser , async(req,res)=>{
       try{
           const user = await User.findByCredential(req.body.username,req.body.password);
           if(user === 404) return res.status(404).json({Error : 'Wrong Credentials'});
           const token = user.genrateAuthToken();
           res.status(200).json({token,user});
       }catch(e){
           res.status(500).json(e);
       }

})

//fetch user details

router.get('/details', auth ,(req,res)=>{
    res.send(req.user);  
})

// get all users

router.get('/allusers',(req,res)=>{
     User.find().exec((err,users)=>{
         if(err) return res.status(200).json({Error : err});
         res.status(200).json(users);
     })
})

module.exports = router;

