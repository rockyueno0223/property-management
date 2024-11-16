import { Request, Response } from 'express';
import propertyModel from '../models/property.model';
import { Property } from '../../../shared/types/property';

// Get properties
const getProperties = (req: Request, res: Response) => {
  const properties = propertyModel.findAll();
  res.json(properties);
};

// Add property
const addProperty = async (req: Request<{}, {}, Property>, res: Response) => {
  const userId = req.signedCookies.userId;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const {
    title,
    description,
    rent,
    imageUrl,
    street,
    city,
    province,
    postalCode
  } = req.body;
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
  res.json(property);
};

// Update property by id
const updatePropertyById = async (req: Request<{ id: string }, {}, Partial<Property>>, res: Response) => {
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
    imageUrl,
    street,
    city,
    province,
    postalCode
  } = req.body;
  const updatedProperty = propertyModel.editProperty(id, {
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
};

// Delete property by id
const deletePropertyById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = propertyModel.deleteProperty(id);
  if (!isDeleted) {
    res.status(404).json({ success: false, message: 'Property not found' });
    return;
  }
  res.status(200).send('Property deleted');
};

export default {
  getProperties,
  addProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById
};
