
import HttpError from "../middleware/HttpError.js";
import User from "../model/userModel.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import {getWelcomeEmailTemplate,  getForgotPasswordEmailTemplate} from "../services/emailTemplate.js";
import crypto from "crypto";

const addUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const newUser = {
            name,
            email,
            password,
            profilePic: req.file ? req.file.path : null,
            cloudinary_id: req.file ? req.file.filename : null,
            role,
            phone,
        };

        const user = new User(newUser);

        await user.save();
        const token = await user.generateAuthToken();
        await sendEmail({
            to: user.email,
            subject: "Welcome user 🎉",
            html: getWelcomeEmailTemplate({
                userName: user.name,
                subject: "You are now a user 🚀"
            })
        });
        res.status(201).json({ success: true, message: "added successfully!", user, token });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return next(new HttpError("unable to login", 400));
        }

        const token = await user.generateAuthToken();
        res.status(200).json({ success: true, message: "successfully login!!", user, token });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const authLogin = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new HttpError("user not found", 404));
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const logOut = async (req, res, next) => {
    try {
        const user = req.user;

        user.tokens = user.tokens.filter((t) => {
            return t.token != req.token;
        });
        await user.save();
        res.status(200).json({ success: true, message: "user logout successfully!!" });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const logOutAll = async (req, res, next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json({ success: true, message: "user logout all device successfully!" });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const allUser = async (req, res, next) => {
    try {
        const {role,limit,skip,sortBy}=req.query;

        let query = {};

        let sortByValue = {};

        if(role){
            query.role = role;
        }

        const user = await User.find(query).limit(parseInt(limit)||5).skip(parseInt(skip)||0).sort(sortByValue);

        if(sortBy){
            const [field,order] = sortBy.split(":");
            sortByValue[field] = order === "desc" ? -1 : 1;
        }
        const users = await User.find({});

        if (users.length === 0) {
            return next(new HttpError("user not found", 404));
        }

        res.status(200).json({ success: true, message: "user data fetched successfully!!",length:users.length, users });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const updateUser = async (req, res, next) => {
    try {
        const allowedUser = req.params.id || req.user._id;

        const user = await User.findById(allowedUser);
        if (!user) {
            return next(new HttpError("user not found", 404));
        }

        const updates = Object.keys(req.body);

        const allowed = ["name", "password", "phone"];

        const isValid = updates.every((field) => allowed.includes(field));

        if (!isValid) {
            return next(new HttpError("only allowed field can be updated", 400));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== user._id.toString()) {
            return next(new HttpError("access denied", 403));
        }
        updates.forEach((update) => {
            if (update !== "password") {
                user[update] = req.body[update];
            }
        });
        if (req.file) {
            if (user.cloudinary_id) {
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            user.profilePic = req.file.path;
            user.cloudinary_id = req.file.filename;
        }
        await user.save();
        res.status(200).json({ success: true, message: "user data updated successfully!", user })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const allowedUser = req.params.id || req.user._id;
        const user = await User.findById(allowedUser);
        if (!user) {
            return next(new HttpError("user not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== user._id.toString()) {
            return next(new HttpError("access denied", 403));
        }
        if (user.cloudinary_id) {
            await cloudinary.uploader.destroy(user.cloudinary_id);
        }
        await user.deleteOne();

        res.status(200).json({ success: true, message: "user delete successfully!" })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const forgotPassword = async(req,res,next)=>{
    try {
        const { email } = req.body;

        const user = await User.findOne({email});

        if(!user){
            return next(new HttpError("user not found",404));
        }
        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink = `http://localhost:5001/user/reset-password/${resetToken}`;

        await sendEmail({
            to:user.email,
            subject:"reset your password",
            html: getForgotPasswordEmailTemplate(user.name, resetLink)
        })
        
        res.status(200).json({success:true,message:"for reset password email sent successfully!!",resetLink});
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const resetPassword = async(req,res,next)=>{
    try {
        const { token }= req.params;
        const { newPassword , confirmPassword } = req.body;

        if(newPassword !== confirmPassword){
            return next(new HttpError("this password not match",400));
        }
        if (newPassword.length < 6) {
            return next(new HttpError("Password must be at least 6 characters", 400));
        }

        const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

        const user = await User.findOne({
            resetPasswordToken:hashedToken,
            resetPasswordExpiry:{$gt:Date.now()}
        });

        if(!user){
            return next(new HttpError("Token is invalid or expired!!",400));
        }

        user.password = confirmPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;

        await user.save();

        res.status(200).json({success:true,message:"reset password successfully!"})
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
export default { addUser, login, authLogin, logOut, logOutAll, allUser, updateUser, deleteUser,forgotPassword,resetPassword };