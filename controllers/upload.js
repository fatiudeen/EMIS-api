import {User as user} from '../models/user.js'
import {request as _request} from '../models/messages.js'
import ErrorResponse from '../helpers/ErrorResponse.js' 
import fs from 'fs'

/**
 *  UPLOAD ROUTE
 * 
 * contains endpoints the either upload a profile picture (avi)
 * or delete one
 */

//// upload avi
export const newProfileImg = (req, res, next) => {
    user.findOneAndUpdate({_id: req.user._id}, {avi: req.file.path}, (err, doc)=>{
        if (err){
            return next (new ErrorResponse(err.message))

        }
        res.status(201).json({success: true, doc})
    })
}

 //// remove avi
 export const deleteProfileImg = (req, res, next) => {
   fs.unlink(req.user.avi, (err, data) => {
        if (err) {
            return res.status(404).json({ error: err.message });
        }
            user.findOneAndUpdate({username: req.user.username}, {avi: ''} ,(err, doc)=>{
                if (err){
                    return next (new ErrorResponse(err.message))

                }
                res.status(200).json({success: true})
            })
            
        })
        
    }
