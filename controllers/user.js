import bcrypt from "bcryptjs"
import fs from 'fs'

import {User as user} from "../models/user.js"
import {request as _request, mail} from '../models/messages.js'
import { Department } from "../models/dept.js"


//REQUEST //post requests
export const sendRequest = async (req, res) => {
    let from = req.user._id
    let to = req.body.to
    let reference = req.body.reference
    let message = {title: req.body.title,  
        message:{body: req.body.text 
                ,attachment: req.file.path},
            }
    
    let dept = Department.findOne({abbr: to})
    to = dept._id
    if (!dept){
        res.status(400).json({
            success: false,
            error: "select a valid department"
         })
         return
      }
    try {
    
    await _request.create({
        from,
        to,
        reference,
        message
    }).populate({path: 'to', seleect: 'name abbr'})
    .then((doc)=>{
        res.status(200).json({
            success: true,
            doc
        })
    }
    ).catch(err =>{
        res.status(500).json({
            success: false,
            error: err.message
    })
})
  } catch(error){
    res.status(400).json({
        success: false,
        error: error.message
  })
  }
}


//TO-D0/// get one requests

export const getOneRequest = async(req, res) => {
    await _request.findOne({_id: req.params.requestId})
    .populate({ path: 'from', seleect: 'name abbr' })
    .exec((err, doc)=>{
        if (err) {
            res.status(400).json({
                success: false,
                error: err.message
            })
                return
        } else {
            return res.status(201).json({
                success: true,
                message: doc
        })
            
          
        }
    }).clone()
        
}
/////////////////get all requests
export const getAllRequests = (req, res) => {
    let _dept = Department.findOne({_id: req.user.department})
    _request.find({ to: _dept._id })
        .select(['from', 'date', 'title', 'reference'])
        .populate({ path: 'from', seleect: 'name abbr' })
        .exec((err, doc) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    error: err.message
                })
                return
            } else {
                return res.status(201).json({
                    success: true,
                    message: doc
                })
            }
        })
     //.clone()
        
}
//MAILS
    //get one incoming mail
    export const getOneMail = async(req, res) => {
        await mail.findOne({_id: req.pramas.mailId})
        .populate({ path: 'from', seleect: 'name abbr' })
        .exec((err, doc)=>{
            if (err) {
                res.status(400).json({
                    success: false,
                    error: err.message})
                    return
            } else {
                return res.status(201).json({
                    success: true,
                    message: doc
                    
                })
                
              
            }
        })
    }
    ////// get all incoming mails
    export const getAllMails =async(req, res) => {
        await mail.find({to: req.user._id}, (err, doc)=>{
            if (err) {
                res.status(400).json({
                    success: false,
                    error: err.message})
                    return
            } else {
                
                return res.status(201).json({
                    success: true,
                    doc

                })

            }
        }).populate({ path: 'from', seleect: 'name username'}).clone()
    }
    ///////out going mail
    export const sendMail = async (req, res) => {
        let from = req.user._id
        let to = req.body.to
        let message = {title: req.body.title, message:{body: req.body.text ,attachment: req.file.path}}
        
        let _user = user.findOne({username: to})
        to = _user._id
        if (!_user || _user.department != req.user.department){
            res.status(400).json({
                success: false,
                error: "select a valid user in your department"
             })
             return
          }
        try {
        
        await mail.create({
            from,
            to,
            message
        }).then(
            res.status(200).json({
                success: true,
            })
        ).catch(err =>{
            res.status(500).json({
                success: false,
                error: err.message
        })
    })
      } catch(error){
        res.status(400).json({
            success: false,
            error: error.message
      })
      }
    }

    
//LOGS

export const logs = async (req, res, next)=>{
    let _dept = Department.findOne({_id: req.user.department})
    try{
            await _request.find({to: _dept._id} || {from: _dept._id}, (err, doc)=>{
                if (err) {
                    res.status(400).json({
                        success: false,
                        error: err.message})
                        return
                } else {
                    res.status(201).json({
                        success: true,
                        doc
                    })
                    return
                }
            }).clone()
        } catch (error){
            res.status(400).json({
                success: false,
                error: error.message
            })        }
    } 

//MANAGE USER DATA
    // get user profile 
    export const getUser = async (req, res, next)=>{
        try{
            await user.findOne({_id: req.user._id})
            .populate({path: 'department', seleect: 'name abbr'})
            .exec( (err, doc)=>{
            if (err) {
                res.status(400).json({
                    success: false,
                    error: err.message})
                    return
            } else {
                
                res.status(201).json({
                    success: true,
                    doc
                })
                return
            }
        })
    } catch (error){
        res.status(400).json({
            success: false,
            error: error.message
        })}
    }
    //ADD FULL NAME
    export const editName = (req, res, next)=>{
        user.findOneAndUpdate({username: req.user.username}, {name: req.body.name} ,(err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }
            else{
                res.status(200).json({
                    success: true 
                } )
            }
        })
    }
    //ADD RANK
    export const editRank = (req, res, next)=>{
        user.findOneAndUpdate({username: req.user.username}, {rank: req.body.rank} ,(err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
                return
            }
            else{
                res.status(200).json({
                    success: true 
                } )
            }
        })
    }
    //CHANGE PASSWORD
    export const changePassword = (req, res, next)=>{
        let pass = req.body.oldPassword
        let newPass = req.body.newPassword

        if(newPass.length < 6 ){
            return res.status(400).json({
                    success: false,
                    error: "password length must be more than 6"
            })
        }
           
        user.findById(req.user._id).select("+password").exec( (err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: err.message
                })
                return
            }
        
            if (req.body.newPassword != req.body.confirmPassword){
                    res.status(401).json({
                    success: false,
                    error: "confirm the new password"
                })
                return
                }
            let old = doc.password
            var match = bcrypt.compareSync(pass, old)
            if(!match){
                res.status(401).json({
                success: false,
                error: "incorrect old password"
                })
                return
            }

            doc.password = req.body.newPassword
            doc.save()
                .catch(error =>{
                    res.status(400).json({
                        success: false,
                        error: error.message
                    })
                    return
    
                    })
                .then(
                    res.status(200).json({
                        success: true,
                        doc
                    })
                )    
                 
            })
        }
    
    

//SUPPORT////request without jwt/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

//// upload avi
export const newProfileImg = (req, res, next) => {
    user.findOneAndUpdate({_id: req.user._id}, {avi: req.file.path}, (err, doc)=>{
        if (err){
            res.status(500).json({
                success: false,
                error: err.message
            })
            return
        }
        else{
            res.status(200).json({
                success: true
                
             })
        }
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
                    res.status(500).json({
                        success: false,
                        error: err.message
                    })
                    return
                }else{
                    res.status(200).json({
                        success: true,
                    })
                }
            })
            
        })
        
    }

