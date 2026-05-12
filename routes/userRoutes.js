
import express from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { updateUserSchema,createUserSchema } from "../validation/UserSchema.js";
import userController from "../controller/userController.js";
import { authLimiter } from "../middleware/rateLimit.js";
import {uploadProfile} from "../middleware/upload.js";

const router = express.Router();

router.post("/addUser",uploadProfile.single("profilePic"),validate(createUserSchema),userController.addUser);
router.post("/login",authLimiter,userController.login);
router.get("/authLogin",auth,authLimiter,userController.authLogin);
router.post("/logOut",auth,userController.logOut);
router.post("/logOutAll",auth,userController.logOutAll);
router.patch("/update",auth,uploadProfile.single("profilePic"),validate(updateUserSchema),userController.updateUser);
router.delete("/delete",auth,userController.deleteUser);

router.post("/forgot-password",userController.forgotPassword);
router.post("/reset-password/:token",userController.resetPassword);
export default router;