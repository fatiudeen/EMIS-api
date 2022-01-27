import jwt from 'jsonwebtoken'
import {User as user} from "../models/user.js"

export default async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ){
        token= req.headers.authorization.split(' ')[1];
    }
    
    if (!token){
        res.status(401).json({
            success: false,
            error: "Not Authorized"
        })
        return
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const _user = await user.findById(decoded.id)
        if (!_user){
            res.status(404).json({
            success: false,
            error: "User not found"
        })
    }
    req.user = _user

    next()
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        })
    }
    
}
