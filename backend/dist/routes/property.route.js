"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = __importDefault(require("../controllers/property.controller"));
const multer_1 = __importDefault(require("../config/multer"));
const propertyRouter = (0, express_1.Router)();
propertyRouter.get('/', property_controller_1.default.getProperties);
propertyRouter.post('/add', multer_1.default.single("image"), property_controller_1.default.addProperty);
propertyRouter.get('/:id', property_controller_1.default.getPropertyById);
propertyRouter.put('/:id', multer_1.default.single("image"), property_controller_1.default.updatePropertyById);
propertyRouter.delete('/:id', property_controller_1.default.deletePropertyById);
exports.default = propertyRouter;
