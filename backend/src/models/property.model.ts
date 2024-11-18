import { v4 as uuidv4 } from 'uuid';
import { Property } from "../../../shared/types/property";

class PropertyModel {
  private properties: Property[] = [
    {
      id: "1",
      title: "Downtown 2 minutes walk from Vancouver city center station. Get discount first month",
      description: "desc1",
      rent: 900,
      imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyaminmellish-106399.jpg&fm=jpg",
      street: "609 W Hastings St",
      city: "Vancouver",
      province: "BC",
      postalCode: "V6Z AAA",
      ownerId: "aaa",
      createdAt: "2024-6-30",
      updatedAt: "2024-5-30",
    },
    {
      id: "2",
      title: "title2",
      description: "desc2",
      rent: 1200,
      imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyaminmellish-106399.jpg&fm=jpg",
      street: "543 Seymour St",
      city: "Vancouver",
      province: "BC",
      postalCode: "V6Z BBB",
      ownerId: "aaa",
      createdAt: "2024-10-31",
      updatedAt: "2023-12-30",
    },
    {
      id: "3",
      title: "title3",
      description: "desc3",
      rent: 800,
      imageUrl: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyaminmellish-106399.jpg&fm=jpg",
      street: "456 Main St",
      city: "Toronto",
      province: "ON",
      postalCode: "HHH III",
      ownerId: "aaa",
      createdAt: "2024-1-1",
      updatedAt: "2024-4-30",
    }
  ];
  // test code, delete later

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
  createProperty(newProperty: Omit<Property, 'id'| 'createdAt' | 'updatedAt'>): Property {
    const property = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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
