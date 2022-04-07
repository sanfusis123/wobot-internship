const router = require('express').Router();
const auth = require('../middleware/auth');
const excelToJson  = require('convert-excel-to-json');

const multer = require('multer');
const uuid = require('uuid');
const Product = require('../model/product');
const storage = multer.diskStorage({
       destination: './uploads/product',
       filename: function(req,file,cb){
             const uniqueSuffix = uuid.v1()+'.'+file.originalname.split('.').pop();
             cb(null, file.fieldname+'-'+uniqueSuffix);
            }
})

const upload = multer({
     limits:{
         fileSize:1000000
     },
     fileFilter(req,file,cb){
          if(!file.originalname.match(/\.(csv|xlsx)$/)){
              return cb(new Error ("Filee is must be csv | xls"),undefined);
          }
          cb(undefined,true);
     },
     storage
}).single('ProductFile');




router.post('/create',auth,upload, async(req,res)=>{
   
    const result = excelToJson({
        sourceFile: req.file.path ,
        columnToKey: {
            A: 'name',
            B: 'description',
            C:'quantity',
            D:'price'
        }
    });
    
    if(!result) return  res.status(500).json({Error : 'NO data found'});
    const arr = result.Sheet1;
    const me = async(you)=>{
        let data1 = [];
        let error = [];
   
        for(let i=0; i<arr.length;i++){
        let data = arr[i];
        try{
            const product = new Product(data);
            product._createdBy = req.user._id;
            await product.save();
                data1.push(product);
           }catch(e){
               error.push({Error : e,index : i});
           }
           }

         you(data1,error);
    
    }
     me((data1,error)=>{
        if(!error) return res.status(500).json({Error : error});
        res.status(201).json({Products : data1});
       
      
     })
      
    
})


router.get('/allproducts',(req,res)=>{
     Product.find().populate('_createdBy', '_id firstName username')
                   .exec((err ,products)=>{
                    if(err)return res.status(500).json({Error : err});
                    res.status(200).json(products);
           
                   })
         
})





module.exports = router;