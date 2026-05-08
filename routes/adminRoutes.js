
import express from "express";
import checkRole from "../middleware/checkRole.js";
import auth from "../middleware/auth.js";
import { updateUserSchema } from "../validation/UserSchema.js";
import categoryController from "../controller/categoryController.js";
import validate from "../middleware/validate.js";
import userController from "../controller/userController.js";
import serviceController from "../controller/serviceController.js";
import categorySchema from "../validation/categorySchema.js";

const router = express.Router();

router.patch("/update/:id",auth,checkRole("admin", "super_admin"),validate(updateUserSchema),userController.updateUser);
router.delete("/delete/:id", auth, checkRole("admin", "super_admin"), userController.deleteUser);
router.get("/allUser", auth,checkRole("admin", "super_admin"), userController.allUser);

//category
router.post("/addCategory",auth,checkRole("admin","super_admin"),validate(categorySchema),categoryController.add);
router.get("/category/getAllCategory",auth,checkRole("admin","super_admin"),categoryController.getAllCategory);
router.get("/category/getSingle/:id",auth,checkRole("admin","super_admin"),categoryController.getSingleCategory);
router.patch("/category/update/:id",auth,checkRole("admin","super_admin"),categoryController.updateCategory);
router.delete("/category/delete/:id",auth,checkRole("admin","super_admin"),categoryController.deleteCategory);

//service
router.post("/addService",auth,checkRole("admin","super_admin"),serviceController.add);
router.get("/service/getAllService",auth,checkRole("admin","super_admin"),serviceController.getAllService);
router.get("/service/getSingle/:id",auth,checkRole("admin","super_admin"),serviceController.getSingleService);
router.patch("/service/update/:id",auth,checkRole("admin","super_admin"),serviceController.updateService);
router.delete("/service/delete/:id",auth,checkRole("admin","super_admin"),serviceController.deleteService);

export default router;