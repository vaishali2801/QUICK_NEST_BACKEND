import Category from "../model/Category.js";
import Service from "../model/Services.js";

import HttpError from "../middleware/HttpError.js";

const add = async (req, res, next) => {
    try {
        const { name, price, duration, description, isActive, category } = req.body;

        const existingService = await Service.findOne({ name });
        if (existingService) {
            return next(new HttpError("service is already exist", 500));
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return next(new HttpError("category not existed", 500));
        }

        const newService = new Service({
            name,
            price,
            duration,
            description,
            isActive,
            category,
        });

        await newService.save();
        res.status(201).json({ success: true, message: "new service created", newService });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
const getAllService = async (req, res, next) => {
    try {
        const services =await Service.find({});
        if (!services) {
            return next(new HttpError("services not found", 404));
        }
        res.status(200).json({ success: true, message: "service fetched successfully!", services });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getSingleService = async (req, res, next) => {
    try {
        const service =await Service.findById(req.params.id);
        if (!service) {
            return next(new HttpError("service not found", 404));
        }
        res.status(200).json({ success: true, message: "service fetched successfully!", service });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const updateService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return next(new HttpError("Service not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== service.createdBy.toString()
        ) {
            return next(new HttpError("Access denied", 403));
        }
        const updates = Object.keys(req.body);
        if (updates.length === 0) {
            return next(new HttpError("No fields provided to update", 400));
        }
        const allowed = ["name", "description", "price", "duration"];
        const isValid = updates.every((field) => allowed.includes(field));
        if (!isValid) {
            return next(new HttpError("only allowed field can be updated", 400));
        }
        updates.forEach((update) => {
            service[update] = req.body[update];
        });
        await service.save();
        res.status(200).json({ success: true, message: "Service data updated successfully!", service })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return next(new HttpError("Service not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== service.createdBy.toString()
        ) {
            return next(new HttpError("Access denied", 403));
        }
        await service.deleteOne();
        res.status(200).json({
            success: true,
            message: "Service deleted successfully!"
        });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};

export default { add, getAllService, getSingleService, updateService, deleteService };