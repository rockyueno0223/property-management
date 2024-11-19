import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Property } from "../../../shared/types/property";
import { User } from "../../../shared/types/user";
import { MapComponent } from "@/components/MapComponent";
import { Button } from "@/components/ui/button";

export const PropertyDetail = () => {
  const navigate = useNavigate();
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
        setProperty(data.property);
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
          setOwnerData(data.user);
        } catch (error) {
          console.error((error as Error).message);
        }
      }
    }

    fetchOwnerData();
  },[property])

  return (
    <div className="w-full max-w-screen-md mx-auto p-3">
      <div className="my-3">
        <h1 className="text-lg font-semibold">{property?.title}</h1>
        <p className="w-full text-right text-sm text-gray-500 dark:text-gray-400">
          {property?.createdAt
            ? new Date(property.createdAt).toLocaleString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(',', '').replace(/-/g, '/')
            : 'N/A'
          }
        </p>
      </div>
      {property?.imageUrl &&
        <img
          src={property?.imageUrl || ''}
          alt={property?.title}
          className="max-w-full h-auto rounded shadow-md"
        />
      }
      <div className="py-3">
        {property?.description &&
          <p className="my-2 whitespace-pre-wrap">{property.description}</p>
        }
        <p className="flex gap-2">
          <span className="text-lg font-semibold">Rent</span>
          <span className="text-lg text-red-500 font-semibold">${property?.rent}</span>
        </p>
        <p className="flex items-end gap-2">
          <span className="text-lg font-semibold">Address</span>
          {property?.street}, {property?.city}, {property?.province}
        </p>
      </div>
      <MapComponent address={`${property?.street}, ${property?.city}, ${property?.province}`} />
      <div className="py-3">
        <p className="flex items-end gap-2">
          <span className="text-lg font-semibold">Owner</span>
          {ownerData?.username}
        </p>
        <p className="flex items-end gap-2">
          <span className="text-lg font-semibold">Email</span>
          <a
            href={`mailto:${ownerData?.email}`}
            className="text-blue-500 underline hover:text-blue-700"
          >
            {ownerData?.email}
          </a>
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate('/dashboard')}
        className="w-full"
      >
        Back to Dashboard
      </Button>
    </div>
  )
}
