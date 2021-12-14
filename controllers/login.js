import {User as user} from "../models/user.js"
import bcrypt from "bcryptjs"


export const login = async (req, res, next) =>{
  const {username, password} = req.body
  const _user = await user.findOne({username}).select("+password")


  if (!username || !password){
      res.json({
          sucess: false,
          message: "provide a username and a password"

      }) 
      return
    }
   try {
        if (!_user){
            res.status(400).json({
                success: false,
                message: "Invalid Details"
            })
            return
        }
        
        bcrypt.compare(password, _user.password).then((isMatch) =>{
            if (isMatch){
            const token =_user.getSignedToken()
            res.status(201).json({
                success: true,
                token
            })
        
            } else {
            res.status(400).json({
                success: false,
                error: "Invalid Details"
            })
            return
            }
        })
    }
     catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }

  
}


