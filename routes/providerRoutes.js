
import express from "express";
import providerController from "../controller/providerController.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import {uploadDocument} from "../middleware/upload.js";

const router  = express.Router();

router.post("/registerProvider",auth,uploadDocument.array("documents",3),providerController.registerAsProvider);
router.get("/getProvider",auth,checkRole("admin","super_admin"),providerController.getProvider);
router.patch(
    "/update-provider",
    auth,
    uploadDocument.single("documents"),
    providerController.updateProvider);

router.patch(
    "/update-provider/:id",
    auth,
    uploadDocument.single("documents"),
    checkRole("admin","super_admin"),
    providerController.updateProvider
);

router.delete("/delete-provider",auth,checkRole("admin","super_admin","provider"),providerController.deleteProvider);
router.get("/getBookingProvider",auth,checkRole("provider"),providerController.getBookingProvider);
router.get("/getBookingProvider/:id",auth,checkRole("admin","super_admin"),providerController.getBookingProvider);
export default router;