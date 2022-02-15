import {User as user} from '../models/user.js'
import {request as _request, mail} from '../models/messages.js'
import { Department } from '../models/dept.js'
import ErrorResponse from '../helpers/ErrorResponse.js' 

/**
 * there a to types of messages
 * 
 * requests: are messages sent on a departmental level, includes file dispatch and other 
 * departmental requests
 * 
 * mails: are messages sent from one user to another
 */

/**
 * REQUESTS
*/

//post requests
export const sendRequest = (req, res, next) => {
    let data = {}
    let path = []

    if (req.files != null){ req.files.map(file => {path.push(file.path)})}

    data.from = req.user.department
    data.reference = req.body.reference
    data.message = {title: req.body.title,  
        message:{body: req.body.text, 
                attachment: path},
            }

        console.log(data.message.attachment)
    _request.findOne({reference: data.reference})
    .then((doc)=>{
        if (doc){
            return next (new ErrorResponse('Request Exists', 409))
        }
        Department.findOne({abbr: req.body.to})
        .then(doc=>{
        data.to = doc._id
        if (!doc){
            return next (new ErrorResponse('Invalid Department', 404))
        }
    })
    
      if (data.to === data.from){
        return next (new ErrorResponse('Forbbidden: cannot select this Department', 403))
         }
      }).catch(err=>{
        return next (new ErrorResponse(err.message))
         })
    

    _request.create({form: data.from,
                    to: data.to,
                    reference: data.reference,
                    message: data.message
                  })
    .then((doc)=>{
        doc.to = req.body.to
        res.status(201).json({success: true, doc})

    }
    ).catch(err =>{
        return next (new ErrorResponse(err.message))
    })
}


//get one requests
export const getOneRequest = (req, res, next) => {
    _request.findOne({_id: req.params.requestId})
    .populate({ path: 'from', seleect: 'name abbr' })
    .exec((err, doc)=>{
        if (err) {
            return next (new ErrorResponse(err.message))
        }
        res.status(201).json({success: true, doc})

    })       
}

//get all requests
export const getAllRequests = async (req, res, next) => {

    _request.find({ to: req.user.department})
    .populate({ path: 'from', select: 'name abbr' })
    .select(['from', 'message.date', 'message.title', 'reference'])
    .then(doc=>{
        res.status(201).json({success: true, doc})

    }).catch(err=>{
        return next (new ErrorResponse(err.message))
    })  
}


/**
 * MAILS
 * 
 * in addition, mails can only be sent to members of the same department
 */
   
//post outgoing mail
    export const sendMail = (req, res) => {
        let from = req.user._id
        let to = req.body.to
        let message = {title: req.body.title, message:{body: req.body.text ,attachment: req.file.path}}
        
        let _user = user.findOne({username: to})
        to = _user._id
        if (!_user || _user.department != req.user.department){
            return next (new ErrorResponse('select a valid user in your department', 400))

          }
        
        mail.create({
            from,
            to,
            message
        }).then(
            res.status(201).json({success: true})

        ).catch(err =>{
            return next (new ErrorResponse(err.message))
    })

}


//get one incoming mail
    export const getOneMail = async(req, res, next) => {

        mail.findOne({_id: req.pramas.mailId})
        .populate({ path: 'from', seleect: 'name abbr' })
        .exec((err, doc)=>{
            if (err) {
                return next (new ErrorResponse(err.message))

            }
            res.status(201).json({success: true, doc})

        })
    }


// get all incoming mails
export const getAllMails = (req, res, next) => {
    mail.find({to: req.user._id})
    .populate({ path: 'from', seleect: 'name username'})
    .select(['from', 'message.date', 'message.title', 'reference'])
    .exec((err, doc)=>{
        if (err) {
            return next (new ErrorResponse(err.message))
        } else {
            
            res.status(201).json({success: true, doc})

        }
    })    
}


/**
 * Logs returns the list of all the requests associated with a given department
 */
    
//LOGS

export const logs = (req, res, next)=>{

    _request.find({to: req.user.department} || {from: req.user.department})
    .populate({path: 'from', select:'name abbr' }).then(doc=>{
        res.status(201).json({success: true, doc})

    }).catch(err=>{
           return next (new ErrorResponse(err.message))
    })

}