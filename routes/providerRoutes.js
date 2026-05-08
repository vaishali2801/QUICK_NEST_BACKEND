
import express from "express";
import providerController from "../controller/providerController.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";

const router  = express.Router();

router.post("/registerProvider",auth,providerController.registerAsProvider);
router.get("/getProvider",auth,checkRole("admin","super_admin"),providerController.getProvider);
router.patch(
    "/update-provider",
    auth,
    upload.single("documents"),
    providerController.updateProvider);

router.patch(
    "/update-provider/:id",
    auth,
    upload.single("documents"),
    checkRole("admin","super_admin"),
    providerController.updateProvider
);

router.delete("/delete-provider",auth,checkRole("admin","super_admin","provider"),providerController.deleteProvider);
router.get("/getBookingProvider",auth,checkRole("provider"),providerController.getBookingProvider);
router.get("/getBookingProvider/:id",auth,checkRole("admin","super_admin"),providerController.getBookingProvider);
export default router;