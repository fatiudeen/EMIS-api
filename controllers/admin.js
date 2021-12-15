import {User as user} from "../models/user.js"
import { Department } from "../models/dept.js"
import {request as _request, mail} from '../models/messages.js'


///////manage department ////////////////////////////////////////////////////////////////////

//create department
export const createDept  = async (req, res, next)=>{

    let {name, abbr} = req.body

    try {
        const dept = await Department.findOne({name})
        if (dept){
            res.status(400).json({
                success: false,
                message: "Department exists"
            })
            return
        }
        else await Department.create({
            name, abbr
        })
        
        res.status(201).json({
            success: true,
            
            
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

//delete department
export const deleteDept  = async (req, res, next)=>{
    Department.findByIdAndDelete(req.params.id, (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: err.message
            })
        }
        else{
            res.status(200).json({
                success: true
            })
        }
    })

}
//get all dept

export const allDepts = async (req, res, next)=>{
    try{
            await Department.find({}, (err, doc)=>{
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

//find one dept

export const getOneDept = async (req, res, next)=>{
    try{
        await Department.findOne({_id: req.params.id}, (err, doc)=>{
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
    })}
}

//get users of one dept
////////////////////////////////////////////////////////////////////////////
export const getUsersFromDept = async (req, res, next)=>{
    let _dept
    await Department.findOne({_id: req.params.id}).then(doc=>{
        _dept = doc
    }).catch(err=>{
        return res.status(400).json({
            success: false,
            error: err.message
        })
    })
    try{
            await user.find({department: _dept._id}, (err, doc)=>{
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

//manage user data////////////////////////////////////////////////////////////////////


    //get all users
export const getUsers = async (req, res, next)=>{
    try{
            await user.find({}, (err, doc)=>{
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
    //get one user
export const getOneUser = async (req, res, next)=>{
    try{
        await user.findById(req.params.id, (err, doc)=>{
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
        
        }
    }).clone()
} catch (error){
    res.status(400).json({
        success: false,
        error: error.message
    })}
}
    //register user
export const registerUser = async (req, res, next) =>{
    let {username, password, role, department} = req.body

    try {
        const _user = await user.findOne({username}).select("+password")
        if (_user){
            res.status(400).json({
                success: false,
                message: "User exists"
            })
            return
        }
        const dept = await Department.findOne({department})
        if(!dept){
            res.status(401).json({
                success: false,
                error: 'Department does not exist'
            })
            return
        }
        username = username + '@' + dept.abbr
        department = dept
        await user.create({
            username, password, role, department
        })
        
        res.status(201).json({
            success: true,
            
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }

} 
    //DELETE USER
export const deleteUser = async (req, res, next)=>{
    user.findByIdAndDelete(req.params.id, (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
        else{
            res.status(200).json({
                success: true,            })
        }
    })

} 
    //EDIT PASSWORD
export const editPassword = (req, res, next)=>{
    let pass = req.body.password
    if(pass.length < 6){
        return res.status(400).json({
                success: false,
                error: "password length must be more than 6"
        })
    }
    user.findById(req.params.id).select('+password').exec( (err, doc)=>{
        if (err){
            res.status(400).json({
                success: false,
                error: err.message
            })
            return
        }
        else{
            doc.password = req.body.password
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
        }
    })
}

    //EDIT ROLE
export const editRole = (req, res, next)=>{
        user.findOneAndUpdate({_id: req.params.id}, {role: req.body.role} ,{new: true}, (err, doc)=>{
            if (err){
                res.status(400).json({
                    success: false,
                    error: error.message
                })
            }
            else{
                res.status(200).json({
                    success: true,
                    doc
                } )
            }
        })
    }


//activity LOGS 
