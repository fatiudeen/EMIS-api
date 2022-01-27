import mongoose from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        match: [
            /^[a-zA-Z]+@[a-zA-Z]+$/i, "provide a valid username"
        ]
    },
    name: {
        type: String,
        required: false,
        default: ''
    },
    
    rank: {
        type: String,
        required: false,
        default: ''
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ['Registry', 'Cheif Clerk', 'PA', 'Director', 'Cheif', 'Administrator']
    },
    isAdmin: {
        type: Boolean,
        default: false
    
    },

    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },

    avi:{
        type: String,
        required: false,
        default: ''
    }

});



userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        next()

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    
    if(this.role === "Administrator"){
        this.isAdmin = true
    }
    next()
        
    })


userSchema.methods.getSignedToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_TIMEOUT} )
}

const User = mongoose.model('User', userSchema);


export {User }