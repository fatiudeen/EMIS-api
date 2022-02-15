import {User as user} from '../models/user.js'
import ErrorResopnse from '../helpers/ErrorResponse.js' 

//login route
export default async (req, res, next) =>{
  const {username, password} = req.body

   if (!username || !password){
       return next(new ErrorResopnse('provide a username and a password', 400))
    }
    
   try {
    const _user = await user.findOne({username}).select('+password')

        if (!_user){
           return next(new ErrorResopnse('Invalid Details', 401))
        }
        
        const isMatch = await _user.comparePasswords(password)
        if (!isMatch){
            return next(new ErrorResopnse('Invalid Details', 401))
         }
        const token  = _user.getSignedToken() 
         res.status(201).json({success: true, token })
    }
     catch (error) {
        next(error)
    }
}


