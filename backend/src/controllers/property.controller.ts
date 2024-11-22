import { Request, Response } from 'express';
import Property from '../models/property.model';
import User from '../models/user.model';
import { deleteImage, uploadImage } from '../utils/cloudinary.util';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Get properties
const getProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().populate("ownerId", "username email");
    res.json({ properties, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get properties" });
  }
};

// Add property
const addProperty = async (req: MulterRequest, res: Response) => {
  const userId = req.signedCookies.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'User not authenticated' });
    return;
  }

  const {
    title,
    description,
    rent,
    street,
    city,
    province,
    postalCode
  } = req.body;

  let imageUrl: string | null = null;

  // upload image to cloudinary
  if (req.file) {
    try {
      imageUrl = await uploadImage(req.file.path, "property-management");
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
      return;
    }
  }

  try {
    const newProperty = new Property({
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
    const savedProperty = await newProperty.save();
    res.status(201).json({ property: savedProperty, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create property" });
  }
};

// Get property by id
const getPropertyById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id).populate("ownerId", "username email");
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }
    res.json({ property, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get property" });
  }
};

// Update property by id
const updatePropertyById = async (req: MulterRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.signedCookies.userId;

  try {
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }
    if (property.ownerId.toString() !== userId) {
      res.status(403).json({ success: false, message: "You are not allowed to update this Property" });
      return;
    }

    const {
      title,
      description,
      rent,
      street,
      city,
      province,
      postalCode
    } = req.body;

    let imageUrl = property.imageUrl;
    // upload image to cloudinary
    if (req.file) {
      try {
        // Delete old image if it exists
        if (property.imageUrl) {
          const publicId = property.imageUrl.split('/').slice(-2).join('/').split('.')[0];
          if (publicId) {
            await deleteImage(publicId);
          }
        }

        // Upload new image
        imageUrl = await uploadImage(req.file.path, "property-management");
      } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
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

    const updatedProperty = await property.save();
    res.status(200).json({ updatedProperty, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update property" });
  }
};

// Delete property by id
const deletePropertyById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property not found" });
      return;
    }

    // Delete the image from Cloudinary
    if (property.imageUrl) {
      try {
        const publicId = property.imageUrl
        .split("/").slice(-2).join("/").split(".")[0];
        await deleteImage(publicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Proceed with property deletion even if image deletion fails
      }
    }

    // Delete data from database
    await Property.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete property" });
  }
};

export default {
  getProperties,
  addProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById
};
