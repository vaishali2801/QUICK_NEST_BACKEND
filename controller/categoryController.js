
import HttpError from "../middleware/HttpError.js";

import Category from "../model/Category.js";

const add = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return next(new HttpError("category already existed", 500));
        }
        const newCategory = new Category({
            name,
            description
        });
        await newCategory.save();
        res.status(201).json({ success: true, message: " added successfully", newCategory });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
const getAllCategory = async (req, res, next) => {
    try {
        const category =await Category.find({});
        if (!category || category.length === 0) {
            return next(new HttpError("No categories found", 404));
        }
        res.status(200).json({ success: true, message: "category fetched successfully!", category });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const getSingleCategory = async (req, res, next) => {
    try {
        const category =await Category.findById(req.params.id);
        if (!category) {
            return next(new HttpError("category not found", 404));
        }
        res.status(200).json({ success: true, message: "category fetched successfully!", category });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new HttpError("category not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== category.createdBy.toString()
        ) {
            return next(new HttpError("Access denied", 403));
        }
        const updates = Object.keys(req.body);
        if (updates.length === 0) {
            return next(new HttpError("No fields provided to update", 400));
        }
        const allowed = ["name", "description"];
        const isValid = updates.every((field) => allowed.includes(field));
        if (!isValid) {
            return next(new HttpError("only allowed field can be updated", 400));
        }
        updates.forEach((update) => {
            category[update] = req.body[update];
        });
        await category.save();
        res.status(200).json({ success: true, message: "category data updated successfully!", category })
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
}
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new HttpError("category not found", 404));
        }
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin" &&
            req.user._id.toString() !== category.createdBy.toString()
        ) {
            return next(new HttpError("Access denied", 403));
        }
        await category.deleteOne();
        res.status(200).json({
            success: true,
            message: "category deleted successfully!"
        });
    } catch (error) {
        next(new HttpError(error.message, 500));
    }
};
export default { add, getAllCategory, getSingleCategory, updateCategory, deleteCategory };