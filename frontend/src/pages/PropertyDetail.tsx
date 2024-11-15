import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Property } from "../../../shared/types/property";
import { User } from "../../../shared/types/user";

export const PropertyDetail = () => {
  const { propertyId } = useParams<{ propertyId: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [ownerData, setOwnerData] = useState<User | null>(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const res = await fetch(`http://localhost:3500/api/properties/${propertyId}`);
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setProperty(data);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchPropertyDetail();
  }, [propertyId]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (property?.ownerId) {
        try {
          const res = await fetch(`http://localhost:3500/api/users/${property?.ownerId}`);
          const data = await res.json();
          if (data.success === false) {
            console.error(data.message);
            return;
          }
          setOwnerData(data);
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    }

    fetchOwnerData();
  },[property])

  return (
    <div className="w-full max-w-screen-md mx-auto p-3">
      <h1 className="text-lg font-semibold my-3">{property?.title}</h1>
      <img
        src={property?.imageUrl}
        alt={property?.title}
        className="w-full h-auto"
      />
      <div className="p-2">
        <p>{property?.description}</p>
        <p>
          Rent: <span className="text-lg text-red-500 font-semibold">${property?.rent}</span>
        </p>
        <p>Address: {property?.street}, {property?.city}, {property?.province}</p>
        <p>
          Owner: {ownerData?.username}<br/>
          {ownerData?.email}
        </p>
        <p>{property?.createdAt}</p>
      </div>
    </div>
  )
}
