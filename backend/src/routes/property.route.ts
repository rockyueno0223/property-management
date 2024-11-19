import { Router, Request, Response } from 'express';
import propertyController from '../controllers/property.controller';
import upload from '../config/multer';

const propertyRouter = Router();

propertyRouter.get('/', propertyController.getProperties);
propertyRouter.post('/add', upload.single("image"), propertyController.addProperty);

propertyRouter.get('/:id', propertyController.getPropertyById);
propertyRouter.put('/:id', upload.single("image"), propertyController.updatePropertyById);
propertyRouter.delete('/:id', propertyController.deletePropertyById);

export default propertyRouter;
