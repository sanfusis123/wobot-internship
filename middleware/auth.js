const jwt = require('jsonwebtoken');
const User = require('../model/user');


const auth = async(req,res,next) =>{
        try {const token = req.header('authorization').replace('Bearer ', '');
         if(!token) return res.status(404).json({Error : 'Token Not found'});
         const decode = jwt.verify(token , process.env.JWt_SECRET);
         if(!decode) return res.status(404).json({Error : 'Access denided'});
         const user = await  User.findOne({_id : decode._id , 'tokens.token' : token});
         if(!user) return res.status(404).json({Error : 'Access denided'});
         req.user = user;
         req.token = token;
          next();
         }catch(e){
             res.status(500).json(e);
         }

        }



module.exports = auth;        