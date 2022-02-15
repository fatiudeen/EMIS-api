import express from 'express'
import {
        getUser,
        updateUser,
        changePassword,
        } from '../controllers/user.js'
        
import {newProfileImg, deleteProfileImg} from '../controllers/upload.js'
import {
        allDepts,
        getOneDept,
        getUsersFromDept
        } from '../controllers/dept.js'

import {
        sendMail,
        sendRequest,
        getAllMails,
        getAllRequests,
        getOneMail,
        getOneRequest,
        logs
} from '../controllers/messages.js'
import {upload,  avi} from '../middlewares/upload.js'

const router = express.Router()

//manage user data 
router.get('/user', getUser)

router.post('/profile/avi', avi, newProfileImg)

router.delete('/profile/avi', deleteProfileImg)
 
router.patch('/profile/update', updateUser)

router.patch('/profile/password', changePassword)

//request
router.post('/request', upload, sendRequest)

router.get('/request', getAllRequests)

router.get('/request/:requestId', getOneRequest)

router.get('/department', allDepts)

router.get('/department/:id', getOneDept)

//mail 
router.post('/mail', upload, sendMail)

router.get('/mail', getAllMails)

router.get('/mail/:mailId', getOneMail)

router.get('/users', getUsersFromDept)

router.get('/users/:id', getUser)

//logs
router.get('/logs', logs)

export default router