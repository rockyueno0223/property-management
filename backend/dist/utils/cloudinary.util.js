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
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const uploadImage = (imagePath, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.uploader.upload(imagePath, {
            folder,
            use_filename: true,
            unique_filename: false,
            transformation: [
                {
                    width: 1200,
                    crop: "scale",
                },
                {
                    quality: "auto",
                    fetch_format: "auto"
                },
            ],
        });
        return result.secure_url;
    }
    catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
});
exports.uploadImage = uploadImage;
const deleteImage = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.default.uploader.destroy(publicId);
        return result.result === "ok";
    }
    catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        return false;
    }
});
exports.deleteImage = deleteImage;
