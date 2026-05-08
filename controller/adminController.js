import User from "../model/User.js";
import Bookings from "../model/Booking.js";
import Provider from "../model/Provider.js";
import Service from "../model/Services.js";

import HttpError from "../middleware/HttpError.js"; 

const dashBoardStatics = async(req ,res ,next)=>{
    try {
        const totalUser = await User.countDocuments();
        const totalCustomer = await User.countDocuments({role:"customer"});
    } catch (error) {
        
    }
}