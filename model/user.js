const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const userSchema = new mongoose.Schema({
      firstName:{
          type:String,
          required:true,
          trim:true
      },
      lastName:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    Password:{
        type:String,
        trim:true
    },
    salt:{
        type:String
    },
    tokens:[{
        token:{
        type:String,
        default:[]
         }
        }]

},{timestamps : true})



userSchema.methods = {
    encryptPassword(passowrd){
        if(!passowrd) return '';
        try{
           return crypto.createHmac('sha256',this.salt)
                        .update(passowrd)
                        .digest('hex');
        }catch(e){
           console.log(e);
        }
    },
    
    genrateAuthToken (){
        const user = this;
        const token = jwt.sign({_id: user._id},process.env.JWt_SECRET);
        user.tokens = user.tokens.concat({token});
        user.save();
        return token;
    }
}


userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.Password;
    delete userObject.tokens;
    delete userObject.salt;
    return userObject;
}

userSchema.statics.findByCredential = async(username,password)=>{
         const user = await User.findOne({username});
         if(!user) return 404;
         const isMatch = user.Password === user.encryptPassword(password);
         if(!isMatch) return 404;
        return user;

}




userSchema.virtual('password').set(function(password){
        this._password = password;
        this.salt = uuid.v1();
        this.Password =    this.encryptPassword(password);
}).get(()=> this._password);






const User = mongoose.model("User", userSchema);

module.exports = User;


