"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const propertySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null,
    },
    rent: {
        type: Number,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: null,
    },
    ownerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });
const Property = (0, mongoose_1.model)("Property", propertySchema);
exports.default = Property;
