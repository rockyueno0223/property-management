import { Schema, model, Document, Types } from "mongoose";
import { Property as PropertyType } from "../../../shared/types/property";

type PropertyDocument = Omit<PropertyType, "ownerId"> & {
  ownerId: Types.ObjectId;
} & Document;

const propertySchema = new Schema<PropertyDocument>({
  title: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, { timestamps: true });

const Property = model<PropertyDocument>("Property", propertySchema);

export default Property;
