import express from 'express'
import {registerUser,
     deleteUser, 
     editPassword, 
     editRole, 
     getUsers,
     getOneUser,
     createDept,
     deleteDept,
     allDepts,
     getOneDept,
     getUsersFromDept,
    
    } from '../controllers/admin.js'
import {getOneRequest,
        sendMail,
        getAllRequests,
        getAllMails,
        getOneMail,
        sendRequest
        } from '../controllers/user.js'
import verifyAdmin from '../middlewares/verifyAdmin.js'
import { upload } from '../middlewares/upload.js'


const router = express.Router()
//manage department
router.post("/dept/create", verifyAdmin, createDept)

router.get("/dept", verifyAdmin, allDepts)

router.get("/dept/:id/users", verifyAdmin, getUsersFromDept)

router.get("/dept/:id", verifyAdmin, getOneDept)

router.delete("/dept/:id/delete", verifyAdmin, deleteDept)


//manage user
    router.get("/users", verifyAdmin, getUsers)

    router.get("/users/:id", verifyAdmin, getOneUser)

    router.post("/users/create", verifyAdmin, registerUser)

    router.delete("/users/:id/delete", verifyAdmin, deleteUser)

    router.patch("/users/:id/editPassword", verifyAdmin, editPassword)

    router.patch("/users/:id/editRole", verifyAdmin, editRole)

//request
router.post("/request", verifyAdmin, upload.single('file'), sendRequest)

router.get("/request/:requestId", verifyAdmin, getAllRequests)

router.get("/user", verifyAdmin, getOneRequest)

//mail 
router.post("/mail", verifyAdmin, upload.single('file'), sendMail)

router.get("/mail", verifyAdmin, getAllMails)

router.get("/mail/:mailId", verifyAdmin, getOneMail)

export default router