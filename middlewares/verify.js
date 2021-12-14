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
        const decoded = jwt.verify(token, "2e49ba87f494618f11e685307db3793969aa47bb17c41cd1feef0348cf03638b29bc2a")
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
