import { Router, Request, Response } from 'express';
import propertyController from '../controllers/property.controller';

const propertyRouter = Router();

propertyRouter.get('/', propertyController.getProperties);
propertyRouter.post('/add', propertyController.addProperty);

propertyRouter.get('/:id', propertyController.getPropertyById);
propertyRouter.put('/:id', propertyController.updatePropertyById);
propertyRouter.delete('/:id', propertyController.deletePropertyById);

export default propertyRouter;
