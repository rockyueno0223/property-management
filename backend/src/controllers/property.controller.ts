import { Request, Response } from 'express';
import propertyModel from '../models/property.model';
import { Property } from '../../../shared/types/property';
import { uploadImage } from '../utils/cloudinary.util';
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Get properties
const getProperties = (req: Request, res: Response) => {
  const properties = propertyModel.findAll();
  res.json({ properties, success: true });
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

  const property = propertyModel.createProperty({
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

  if (property) {
    res.status(201).json({ property, success: true });
  }
};

// Get property by id
const getPropertyById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const property = propertyModel.findById(id);
  if (!property) {
    res.status(404).json({ success: false, message: 'Property not found' });
    return;
  }
  res.json({ property, success: true });
};

// Update property by id
const updatePropertyById = async (req: MulterRequest, res: Response) => {
  const { id } = req.params;
  const property = propertyModel.findById(id);
  const userId = req.signedCookies.userId;

  if (!property) {
    res.status(404).json({ success: false, message: "Property not found" });
    return;
  }
  if (property.ownerId !== userId) {
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
      imageUrl = await uploadImage(req.file.path, "property-management");
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
      return;
    }
  }

  const updatedData: Partial<Property> = {
    title: title || property.title,
    description: description || null,
    rent: rent !== undefined ? rent : property.rent,
    imageUrl: imageUrl,
    street: street || property.street,
    city: city || property.city,
    province: province || property.province,
    postalCode: postalCode || property.postalCode,
  };

  const updatedProperty = propertyModel.editProperty(id, updatedData);
  if (updatedProperty) {
    res.status(200).json({ updatedProperty, success: true });
  } else {
    res.status(500).json({ success: false, message: "Failed to update property" });
  }
};

// Delete property by id
const deletePropertyById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = propertyModel.deleteProperty(id);
  if (!isDeleted) {
    res.status(404).json({ success: false, message: 'Property not found' });
    return;
  }
  res.status(200).json({ success: true, message: 'Property deleted' });
};

export default {
  getProperties,
  addProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById
};
