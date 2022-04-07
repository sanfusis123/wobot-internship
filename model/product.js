const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const productSchema = new mongoose.Schema({
      name:{
          type:String,
          required:true,
          trim:true
      },
      description:{
        type:String,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        trim:true,
    },
    price:{
        type:Number,
        trim:true
    },
    _createdBy:{
      type: ObjectId,
      ref:'User'
    }

},{timestamps : true})




const Product = mongoose.model("Product", productSchema);

module.exports = Product;


