import Booking from "../model/Booking.js";
import HttpError from "../middleware/HttpError.js";
import Service from "../model/Services.js";
import sendWhatsAppMessage from "../utils/sendWhatsAppMessage.js";
import redisClient from "../config/redis.js";
import Provider from "../model/Provider.js";

const create = async (req, res, next) => {
    const { serviceId,providerId, bookingDate, timeSlot, notes } = req.body;
    const lockKey = `bookings:${serviceId}:${bookingDate}:${timeSlot}`;

    let lockAcquired = false;
    const userId = req.user._id;

    try {
        if(!serviceId || !providerId || !bookingDate || !timeSlot ){
            return next(new HttpError("some necessary field are missing",404));
        }
        //date validation
        const today = new Date();
        today.setHours(0,0,0,0);

        const selectDate = new Date(bookingDate + "T00:00:00");
        selectDate.setHours(0,0,0,0);

        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 7);

        if( selectDate > maxDate ){
            return next(new HttpError("advanced booking can be book upto 7 days",400));
        }
        if( selectDate < today ){
            return next(new HttpError("can not create bookings for past days",400));
        }

        console.log("Today:", today);
        console.log("Selected:", selectDate);
        console.log("Raw bookingDate:", bookingDate);

        //time validation
        const now = new Date();
        
        if(selectDate.getTime() === today.getTime()){
            const [startTime] = timeSlot.split("-");

            const [hours,minutes] = startTime.trim().split(":").map(Number);

            if(isNaN(hours) || isNaN(minutes)){
                return next(new HttpError("invalid time",400));
            }
            
            const slotDateAndTime = new Date(selectDate);
            slotDateAndTime.setHours(hours,minutes,0,0);

            if(slotDateAndTime < now){
                return next(new HttpError("can't book previous time",400));
            }
        }
        //redis lock 
        const lock = await redisClient.set(lockKey,userId.toString(),{
            NX:true,
            EX:10,
        });

        if(!lock){
            return next(new HttpError("already time slot is booked",409));
        }

        lockAcquired = true;

        //service validation

        const service = await Service.findById(serviceId);

        if (!service) {
            return next(new HttpError("service not exist", 404));
        }
        if (!service.isActive) {
            return next(new HttpError("not active this service. try after few minutes", 409));
        }
        const provider = await Provider.findById(providerId);

        if(!provider){
            return next(new HttpError("provider not found",404));
        }
        
        if(!providerId){
            return next(new HttpError("provider id not found",404));
        }

        const startOfDay = new Date(bookingDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(bookingDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBooking = await Booking.findOne({
            serviceId,
            providerId,
            bookingDate: { $gte: startOfDay, $lt: endOfDay },
            timeSlot,
            status: { $in: ["pending", "confirmed"] }
        });

        if (existingBooking) {
            return next(new HttpError("This time slot is already booked", 409));
        }

        const newBooking = new Booking({
            userId,
            serviceId,
            providerId,
            bookingDate: new Date(bookingDate),
            timeSlot,
            notes,
            totalPrice: service.price,
        });
        await newBooking.save();

        await newBooking.populate([
            {
                path: "serviceId",select: "name price duration -_id"
            },
            { 
                path: "userId", select: "name email phone"
            },{
                path:"providerId",select:"name",
            }
        ]);
        console.log("phone",newBooking.userId.phone);

        await sendWhatsAppMessage(newBooking.userId.phone,"booking has been created successfully!");

        res.status(201).json({ success: true, message: "booking confirm successfully", newBooking });
        
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
    finally{
        if(lockAcquired){
            await redisClient.del(lockKey);
        }
    }
}
const getAllBooking = async (req, res, next) => {
    try {
        let bookings;
        let Role = req.user.role;

        if (Role === "admin" || Role === "super_admin") {
            bookings = await Booking.find({}).populate([
                { path: "serviceId", select: "name price duration description" },
                { path: "userId", select: "name email phone" },
            ])
        } else if (Role === "customer") {
            bookings = await Booking.find({ userId: req.user._id })
                .populate("serviceId", "name price duration");
        } else {
            return next(new HttpError("unAuthorization access", 401));
        }
        if (bookings.length === 0) {
            return res.status(200)
                .json({ success: true, message: "booking data not found" });
        }
        res.status(200).
            json({ success: true, message: "all booking fetched successfully!!!!", bookings });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getAllService = async (req, res, next) => {
    try {
        let bookings;
        let Role = req.user.role;
        const serviceId = req.params.id;

        if (Role === "admin" || Role === "super_admin") {
            bookings = await Booking.find({ serviceId })
                .populate([
                    { path: "serviceId", select: "name price duration description" },
                    { path: "userId", select: "name email phone" }
                ]);
        } else if (Role === "customer") {
            bookings = await Booking.find({ userId: req.user._id, serviceId: serviceId })
                .populate("serviceId", "name price duration description");
        } else {
            return next(new HttpError("unAuthorization access", 401));
        }
        if (bookings.length === 0) {
            return res.status(200)
                .json({ success: true, message: "booking data not found" });
        }
        res.status(200).
            json({ success: true, message: "all booking service fetched successfully!!!!", bookings });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getBookingById = async (req, res, next) => {
    try {
        let bookings;
        const userId = req.user._id;
        const bookingId = req.params.id;
        const Role = req.user.role;

        if (Role === "admin" || Role === "super_admin") {
            bookings = await Booking.findById(bookingId).populate([
                { path: "serviceId", select: "name price duration" },
                { path: "userId", select: "name email phone" }
            ])
        } else {
            bookings = await Booking.findById(bookingId)
                .populate("serviceId", "name price duration");
        }
        if (!bookings) {
            return next(new HttpError("booking data not found", 404));
        }
        if (Role === "customer" && userId.toString() !== bookings.userId.toString()) {
            return next(new HttpError("unauthorize access", 403));
        }
        res.status(200).json({ success: true, message: "booking by id fetched successfully!!", bookings });

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getBookingByUser = async (req, res, next) => {
    try {
        let booking;
        let loginUser = req.user._id;
        let userId = req.user._id;

        if (loginUser) {
            booking = await Booking.find({ userId: loginUser });
        }
        if (userId) {
            booking = await Booking.find({ userId });
        }
        if (!booking.length) {
            return next(new HttpError("no booking data found", 404));
        }
        res.status(200).json({ success: true, message: "booking data fetched successfully", booking })

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const availableTimeSlot = async (req, res, next) => {
    try {
        const { serviceId, bookingDate } = req.query;
        const service = await Service.findById(serviceId);
        if (!service) {
            return next(new HttpError("service not found", 404));
        }
        const startOfDay = new Date(bookingDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(bookingDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBooking = await Booking.find({
            serviceId,
            bookingDate: { $gte: startOfDay, $lt: endOfDay },
            status: { $in: ["pending", "confirmed"] }
        })

        const BookedTimeSlot = existingBooking.map((b) => b.timeSlot)

        const TotalTimeSlots = [
            "9:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "12:00-13:00",
            "13:00-14:00",
            "14:00-15:00",
            "15:00-16:00",
            "16:00-17:00",
            "17:00-18:00",
        ]

        const availableTimeSlots = TotalTimeSlots.filter((b) => !BookedTimeSlot.includes(b));

        if (!availableTimeSlots.length) {
            return res.status(200).json({ success: true, message: "currently no time slot available" })
        }

        res.status(200).json({ success: true, message: "available time slot fetched successfully", availableTimeSlots });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }

}

const confirmBooking = async (req, res, next) => {
    try {
        const id = req.params.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return next(new HttpError("no booking data found", 404));
        }

        if (booking.status === "confirmed") {
            return next(new HttpError("booking is already confirmed"))
        }
        if (booking.status === "cancel") {
            return next(new HttpError("booking is already cancelled"))
        }
        if (booking.status === "completed") {
            return next(new HttpError("booking is already completed"))
        }
        if (booking.status === "pending") {
            booking.status = "confirmed"
        }
        await booking.save();
        res.status(200).json({ success: true, message: "booking confirm successfully!!", booking });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const cancelledBooking = async (req, res, next) => {
    try {
        const id = req.params.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return next(new HttpError("no booking data found", 404));
        }

        if (booking.status === "cancelled") {
            return next(new HttpError("Booking already cancelled!", 400));
        }

        if (booking.status === "completed") {
            return next(new HttpError("You can't cancel a completed booking", 400));
        }

        if (booking.status === "pending" || booking.status === "confirmed") {
            booking.status = "cancelled";
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully!!",
            booking
        });

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
const completeBooking = async (req, res, next) => {
    try {
        const id = req.params.id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return next(new HttpError("No Booking Data Founded..!", 404));
        }

        if (booking.status === "complete") {
            return next(new HttpError("Booking already Completed", 400));
        }

        if (booking.status === "cancelled") {
            return next(
                new HttpError("Booking Already cancelled you can't complete it", 400),
            );
        }

        if (booking.status === "confirmed" || booking.status === "pending") {
            booking.status = "completed";
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking Completed Successfully...!",
            booking,
        });
    } catch (error) {
        next(new HttpError(error.message));
    }
};


export default {
    create, getAllBooking, getAllService, getBookingById,
    getBookingByUser, availableTimeSlot, confirmBooking, cancelledBooking
    , completeBooking
}