import {User as user} from '../models/user.js'
import { Department } from '../models/dept.js'
import ErrorResponse from '../helpers/ErrorResponse.js'

//create department
export const createDept  = async (req, res, next)=>{
/**
 * abbr represents the abbreviation of the department name
 */
    let {name, abbr} = req.body
    try {
        const dept = await Department.findOne({name})
        if (dept){
            return next (new ErrorResponse('Department Exists', 409))
        }
        let doc = await Department.create({
            name, abbr
        })
        res.status(201).json({success: true, doc})


    } catch (error) {
        next(error)
    }
}

//delete department
export const deleteDept  = async (req, res, next)=>{
    Department.findByIdAndDelete(req.params.id, (error, doc)=>{
        if (error){
            return next(error)
        }
        res.status(200).json({success: true})

    })

}
//get all dept
export const allDepts = (req, res, next)=>{
    Department.find({}, (err, doc)=>{
        if (err) {
            return next (new ErrorResponse(err.message, 400))
        } 
        res.status(201).json({success: true, doc})

    }).clone()
} 

//find one dept
export const getOneDept = async (req, res, next)=>{
    await Department.findOne({_id: req.params.id}, (err, doc)=>{
    if (err) {
        return next (new ErrorResponse(err.message, 400))
    }
    res.status(201).json({success: true, doc})

}).clone()
}

//get users of one dept
export const getUsersFromDept = (req, res, next)=>{
    let dept = req.user.isAdmin === true ?
    req.params.id :
    req.user.department

    user.find({department: dept}).clone()
    .then(doc=>{
        res.status(200).json({success: true, doc})

    }).catch(err=>{
        return next (new ErrorResponse(err.message, 400))
    })
} 

