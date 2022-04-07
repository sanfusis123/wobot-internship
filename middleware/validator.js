 const validateUser = (req,res,next)=>{
        const fields = Object.keys(req.body);
        let Error = [];
        fields.forEach((fld)=>{
              if(!req.body[fld]) Error.push({[fld] : `fld is Empty`});
        })
        if(req.body.password.length <8) Error.push({password : 'Must  not be less than 8'});
        if(Error.length) return res.status(500).json({Error});

        next();
}


module.exports = {validateUser}










