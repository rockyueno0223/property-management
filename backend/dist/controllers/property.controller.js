"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const property_model_1 = __importDefault(require("../models/property.model"));
const cloudinary_util_1 = require("../utils/cloudinary.util");
// Get properties
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield property_model_1.default.find().populate("ownerId", "username email");
        res.json({ properties, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get properties" });
    }
});
// Add property
const addProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.signedCookies.userId;
    if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
    }
    const { title, description, rent, street, city, province, postalCode } = req.body;
    let imageUrl = null;
    // upload image to cloudinary
    if (req.file) {
        try {
            imageUrl = yield (0, cloudinary_util_1.uploadImage)(req.file.path, "property-management");
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
            return;
        }
    }
    try {
        const newProperty = new property_model_1.default({
            title,
            description: description || null,
            rent,
            imageUrl: imageUrl || null,
            street,
            city,
            province,
            postalCode,
            ownerId: userId
        });
        const savedProperty = yield newProperty.save();
        res.status(201).json({ property: savedProperty, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to create property" });
    }
});
// Get property by id
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const property = yield property_model_1.default.findById(id).populate("ownerId", "username email");
        if (!property) {
            res.status(404).json({ success: false, message: 'Property not found' });
            return;
        }
        res.json({ property, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to get property" });
    }
});
// Update property by id
const updatePropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.signedCookies.userId;
    try {
        const property = yield property_model_1.default.findById(id);
        if (!property) {
            res.status(404).json({ success: false, message: "Property not found" });
            return;
        }
        if (property.ownerId.toString() !== userId) {
            res.status(403).json({ success: false, message: "You are not allowed to update this Property" });
            return;
        }
        const { title, description, rent, street, city, province, postalCode } = req.body;
        let imageUrl = property.imageUrl;
        // upload image to cloudinary
        if (req.file) {
            try {
                // Delete old image if it exists
                if (property.imageUrl) {
                    const publicId = property.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                    if (publicId) {
                        yield (0, cloudinary_util_1.deleteImage)(publicId);
                    }
                }
                // Upload new image
                imageUrl = yield (0, cloudinary_util_1.uploadImage)(req.file.path, "property-management");
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
                return;
            }
        }
        property.title = title || property.title;
        property.description = description || null;
        property.rent = rent !== undefined ? rent : property.rent;
        property.street = street || property.street;
        property.city = city || property.city;
        property.province = province || property.province;
        property.postalCode = postalCode || property.postalCode;
        property.imageUrl = imageUrl;
        const updatedProperty = yield property.save();
        res.status(200).json({ updatedProperty, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update property" });
    }
});
// Delete property by id
const deletePropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const property = yield property_model_1.default.findById(id);
        if (!property) {
            res.status(404).json({ success: false, message: "Property not found" });
            return;
        }
        // Delete the image from Cloudinary
        if (property.imageUrl) {
            try {
                const publicId = property.imageUrl
                    .split("/").slice(-2).join("/").split(".")[0];
                yield (0, cloudinary_util_1.deleteImage)(publicId);
            }
            catch (error) {
                console.error("Failed to delete image from Cloudinary:", error);
                // Proceed with property deletion even if image deletion fails
            }
        }
        // Delete data from database
        yield property_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Property deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete property" });
    }
});
exports.default = {
    getProperties,
    addProperty,
    getPropertyById,
    updatePropertyById,
    deletePropertyById
};
