import jwt from 'jsonwebtoken'
import {User as user} from '../models/user.js'
import ErrorResponse from '../helpers/ErrorResponse.js'

export default (role) => {
    return async (req, res, next) => {
    let token =
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ?
        req.headers.authorization.split(' ')[1]
        : null

    if (!token){
        return next (new ErrorResponse('Not Authorized' , 401))
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const _user = await user.findById(decoded.id)
        if (!_user){
            return next (new ErrorResponse('User not found' , 404))

    }
    req.user = _user;

    (role == 'admin' && _user.isAdmin === true) || (role == 'user' && _user.isAdmin === false) ?
    next() 
    : next (new ErrorResponse('Unauthorized: user is not an Admin' , 403))

    } catch (error) {
        next(error)
        }

    }
}
