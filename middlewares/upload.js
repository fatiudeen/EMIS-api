import multer from "multer";
import config from "../config.js";
import path from 'path'



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() +'-'+Math.round(Math.random()* 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)

    }
})


const fileFilter =(req, res, cb)=>{
    if (file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' ){
        cb(null, true)
    }else{
        cb(err, false)
    }

}
export const  upload = multer({storage: storage})
export const avi =  multer({storage: storage}, {fileFilter: fileFilter})
//export const avi =  multer({dest: 'uploads/'})

