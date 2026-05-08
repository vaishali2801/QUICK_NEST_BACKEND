
import express from "express";
import auth from "../middleware/auth.js";
import bookingController from "../controller/bookingController.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.post("/create",auth,bookingController.create);

//booking
router.get("/getAllBooking",auth,bookingController.getAllBooking);
router.get("/getAllService/:id",auth,bookingController.getAllService);
router.get("/getBookingById/:id",auth,bookingController.getBookingById);
router.get("/getBookingByUser/:id",auth,bookingController.getBookingByUser);
router.get("/getSlot",auth,bookingController.availableTimeSlot);

//status
router.get("/confirmedBooking/:id",auth,checkRole("admin", "super_admin"),bookingController.confirmBooking);
router.get("/cancelledBooking/:id",auth,checkRole("admin", "super_admin"),bookingController.cancelledBooking);
router.get("/completedBooking/:id",auth,checkRole("admin", "super_admin"),bookingController.completeBooking);

export default router;