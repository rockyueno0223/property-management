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
// Get properties
const getProperties = (req, res) => {
    const properties = property_model_1.default.findAll();
    res.json(properties);
};
// Add property
const addProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.signedCookies.userId;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    const { title, description, rent, imageUrl, street, city, province, postalCode } = req.body;
    const property = property_model_1.default.createProperty({
        title,
        description,
        rent,
        imageUrl,
        street,
        city,
        province,
        postalCode,
        ownerId: userId
    });
    if (property) {
        res.status(201).json({ property, success: true });
    }
});
// Get property by id
const getPropertyById = (req, res) => {
    const { id } = req.params;
    const property = property_model_1.default.findById(id);
    if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
    }
    res.json(property);
};
// Update property by id
const updatePropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const property = property_model_1.default.findById(id);
    const userId = req.signedCookies.userId;
    if (!property) {
        res.status(404).json({ success: false, message: "Property not found" });
        return;
    }
    if (property.ownerId !== userId) {
        res.status(403).json({ success: false, message: "You are not allowed to update this Property" });
        return;
    }
    const { title, description, rent, imageUrl, street, city, province, postalCode } = req.body;
    const updatedProperty = property_model_1.default.editProperty(id, {
        title,
        description,
        rent,
        imageUrl,
        street,
        city,
        province,
        postalCode
    });
    res.status(200).json(updatedProperty);
});
// Delete property by id
const deletePropertyById = (req, res) => {
    const { id } = req.params;
    const isDeleted = property_model_1.default.deleteProperty(id);
    if (!isDeleted) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
    }
    res.status(200).send('Property deleted');
};
exports.default = {
    getProperties,
    addProperty,
    getPropertyById,
    updatePropertyById,
    deletePropertyById
};
