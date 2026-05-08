import mongoose from "mongoose";
import HttpError from "../middleware/HttpError.js";
import User from "../model/userModel.js";
import Provider from "../model/Provider.js";
import Service from "../model/Services.js";
import sendEmail from "../utils/sendEmail.js";
import { getProviderRegistrationEmailTemplate } from "../services/emailTemplate.js";
import Booking from "../model/Booking.js";
import cloudinary from "../config/cloudinary.js";

const registerAsProvider = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("user not found", 404));
        }

        const existingProvider = await Provider.findOne({ userId });
        if (existingProvider) {
            user.role = "provider";
            await user.save();
            await sendEmail({
                to: user.email,
                subject: "Already Registered as Provider",
                html: getProviderRegistrationEmailTemplate({
                    userName: user.name,
                    subject: "Provider Already Exists"
                })
            });
            return res.status(200).json({
                message: "Provider already exists, role updated",
            });
        }

        const { services, experience } = req.body;

        if (!services || !Array.isArray(services) || services.length === 0) {
            return next(new HttpError("service required!!", 400));
        }

        const validService = await Service.find({
            _id: { $in: services }
        }).select("_id");

        if (validService.length !== services.length) {
            return next(new HttpError("service are missing", 400));
        }

        const newProvider = new Provider({
            userId,
            service: validService,
            experience,
            documents:req.file ? req.file.path : null,
            cloudinary_id: req.file ? req.file.filename : null,
        });
        user.role = "provider";
        await newProvider.save();

        await user.save();
        await sendEmail({
            to: user.email,
            subject: "Welcome Provider 🎉",
            html: getProviderRegistrationEmailTemplate({
                userName: user.name,
                subject: "You are now a Provider 🚀"
            })
        });

        res.status(201).json({
            success: true,
            message: "provider created successfully!!",
            newProvider
        });

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
const getProvider = async (req, res, next) => {
    try {
        const { isVerified } = req.query;
        let query = {};

        if (isVerified != undefined) {
            query.isVerified = isVerified === "true";
        }
        const provider = await Provider.find(query).populate([
            { path: "userId", select: "name email phone" },
            { path: "services", select: "name" }
        ]);
        if (!provider.length) {
            return next(new HttpError("no provider data found", 404));
        }
        res.status(200).json({
            success: true,
            message: "providers fetched successfully",
            provider
        });

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getProviderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const provider = await Provider.findById(id);
        if (!provider) {
            return next(new HttpError("provider not found", 404))
        }
        res.status(200).json({ success: true, message: "provider fetched successfully!", provider })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getBookingProvider = async (req, res, next) => {
    try {
        const role = req.user.role;
        let bookings;

        if (role === "provider") {
            const provider = await Provider.findOne({ userId: req.user._id });

            if (!provider) {
                return next(new HttpError("Provider not found", 404));
            }

            bookings = await Booking.find({ providerId: provider._id });

        } else if (role === "admin" || role === "super_admin") {

            bookings = await Booking.find(); // admin gets all bookings

        }

        if (!bookings || bookings.length === 0) {
            return next(new HttpError("No bookings found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            bookings
        });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

const updateProvider = async (req, res, next) => {
    try {
        const allowedUser = req.params.id || req.user._id;

        const provider = await User.findById(allowedUser);

        if (!provider) {
            return next(new HttpError("provider not found", 404));
        }

        const updates = Object.keys(req.body);
        const allowed = ["experience", "documents", "services"];

        const isValid = updates.every((field) => allowed.includes(field));

        if (!isValid) {
            return next(new HttpError("only allowed field can be updated", 400));
        }

        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== provider._id.toString()
        ) {
            return next(new HttpError("access denied", 403));
        }

        updates.forEach((update) => {
            if (update !== "password") {
                provider[update] = req.body[update];
            }
        });

        if (req.file) {
            if (provider.cloudinary_id) {
                await cloudinary.uploader.destroy(provider.cloudinary_id);
            }
            provider.documents = req.file.path;
            provider.cloudinary_id = req.file.filename;
        }

        await provider.save();

        res.status(200).json({
            success: true,
            message: "provider update successfully",
            provider
        });

    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
const deleteProvider = async (req, res, next) => {
    try {
        const allowedUser = req.params.id || req.user._id;
        const provider = await User.findById(allowedUser);
        if (!provider) {
            return next(new HttpError("provider not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== provider._id.toString()) {
            return next(new HttpError("access denied", 403));
        }
        if (provider.cloudinary_id) {
            await cloudinary.uploader.destroy(provider.cloudinary_id);
        }
        await provider.deleteOne();

        res.status(200).json({ success: true, message: "provider delete successfully!" })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}

export default { registerAsProvider, getProvider, getProviderById, getBookingProvider,updateProvider,deleteProvider }    