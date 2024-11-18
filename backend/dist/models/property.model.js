"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class PropertyModel {
    constructor() {
        this.properties = [
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
    }
    // test code, delete later
    // Get all properties
    findAll() {
        return this.properties;
    }
    ;
    // Get property by id
    findById(id) {
        const property = this.properties.find(property => property.id === id);
        if (!property)
            return undefined;
        return property;
    }
    ;
    // Get property by name
    // findByName(name: string): Property | undefined {
    //   const property = this.properties.find(property => property.name === name);
    //   if (property) {
    //     return property;
    //   }
    //   return undefined;
    // };
    // Create property
    createProperty(newProperty) {
        const property = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, newProperty);
        this.properties.push(property);
        return property;
    }
    ;
    // Edit property
    editProperty(id, newData) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const index = this.properties.findIndex(property => property.id === id);
        if (index === -1)
            return undefined;
        const updatedProperty = {
            id: this.properties[index].id,
            createdAt: this.properties[index].createdAt,
            updatedAt: new Date().toISOString(),
            title: (_a = newData.title) !== null && _a !== void 0 ? _a : this.properties[index].title,
            description: (_b = newData.description) !== null && _b !== void 0 ? _b : this.properties[index].description,
            rent: (_c = newData.rent) !== null && _c !== void 0 ? _c : this.properties[index].rent,
            imageUrl: (_d = newData.imageUrl) !== null && _d !== void 0 ? _d : this.properties[index].imageUrl,
            street: (_e = newData.street) !== null && _e !== void 0 ? _e : this.properties[index].street,
            city: (_f = newData.city) !== null && _f !== void 0 ? _f : this.properties[index].city,
            province: (_g = newData.province) !== null && _g !== void 0 ? _g : this.properties[index].province,
            postalCode: (_h = newData.postalCode) !== null && _h !== void 0 ? _h : this.properties[index].postalCode,
            ownerId: this.properties[index].ownerId
        };
        this.properties[index] = updatedProperty;
        return updatedProperty;
    }
    ;
    // Delete property
    deleteProperty(id) {
        const index = this.properties.findIndex(property => property.id === id);
        if (index === -1)
            return false;
        this.properties.splice(index, 1);
        return true;
    }
    ;
}
;
exports.default = new PropertyModel;
