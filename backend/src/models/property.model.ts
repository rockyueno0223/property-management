import { v4 as uuidv4 } from 'uuid';
import { Property } from "../../../shared/types/property";

class PropertyModel {
  private properties: Property[] = [];

  // Get all properties
  findAll(): Property[] {
    return this.properties;
  };

  // Get property by id
  findById(id: string): Property | undefined {
    const property = this.properties.find(property => property.id === id);
    if (!property) return undefined;
    return property;
  };

  // Get property by name
  // findByName(name: string): Property | undefined {
  //   const property = this.properties.find(property => property.name === name);
  //   if (property) {
  //     return property;
  //   }
  //   return undefined;
  // };

  // Create property
  createProperty(newProperty: Omit<Property, 'id'| 'createdAt'>): Property {
    const property = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...newProperty
    };
    this.properties.push(property);
    return property;
  };

  // Edit property
  editProperty(id: string, newData: Partial<Property>): Property | undefined {
    const index = this.properties.findIndex(property => property.id === id);
    if (index === -1) return undefined;
    const updatedProperty: Property = {
      id: this.properties[index].id,
      createdAt: this.properties[index].createdAt,
      title: newData.title ?? this.properties[index].title,
      description: newData.description ?? this.properties[index].description,
      rent: newData.rent ?? this.properties[index].rent,
      imageUrl: newData.imageUrl ?? this.properties[index].imageUrl,
      street: newData.street ?? this.properties[index].street,
      city: newData.city ?? this.properties[index].city,
      province: newData.province ?? this.properties[index].province,
      postalCode: newData.postalCode ?? this.properties[index].postalCode,
      ownerId: this.properties[index].ownerId
    }
    this.properties[index] = updatedProperty;
    return updatedProperty;
  };

  // Delete property
  deleteProperty(id: string): boolean {
    const index = this.properties.findIndex(property => property.id === id);
    if (index === -1) return false;
    this.properties.splice(index, 1);
    return true;
  };
};

export default new PropertyModel;
