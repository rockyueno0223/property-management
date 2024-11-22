export type Property = {
  _id: string;
  title: string;
  description: string | null;
  rent: number;
  imageUrl: string | null;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  ownerId: string | { _id: string };
  createdAt: string;
  updatedAt: string;
}
