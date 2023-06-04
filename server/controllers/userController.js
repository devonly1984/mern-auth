import asyncHandler from 'express-async-handler';
import User from '../mongodb/models/UserModel.js';
import generateToken from '../utils/generateToken.js';
//@desc Auth user/set Token
// route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async(req,res)=>{
    const  {email,password} = req.body;
    
    const user = await User.findOne({email});
    console.log(user);
    if (user && (await user.matchPasswords(password))) {
        generateToken(res,user._id)
        res.status(201).json({_id: user._id, name: user.name, email: user.email});
    } else {
        res.status(401)
        throw new Error("Invalid email or password");
    }

   
})
//@desc Register user/set Token
// route POST /api/users/
// @access Public
const registerUser = asyncHandler(async(req,res)=>{

    const {name,email,password}= req.body;

    
    const userExists = await User.findOne({email});
    

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    } else {
        const user = await User.create({name,email,password});
    if (user) {
        generateToken(res,user._id)
        res.status(201).json({_id: user._id, name: user.name, email: user.email});
    } else {
        res.status(400)
        throw new Error("Invalid User Data");
    }
    }

    
        
})
//@desc Logout user/set Token
// route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: "User was logged out successfully"});
})
//@desc Get User Profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async(req,res)=>{
 
const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
}
    res.status(200).json(user);
})

//@desc LGet User Profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    const {name,email,password} = req.body;
    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    } else {    
        res.status(404);
        throw new Error("User not found")
    }
    
})

export {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile};