import { useEffect, useState } from 'react';
import { Property } from '../../../shared/types/property'
import { PropertyCard } from '@/components/PropertyCard';

export const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch('http://localhost:3500/api/properties');
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        setProperties(data);
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    fetchProperty();
  }, [])
  return (
    <div className="w-full max-w-screen-xl mx-auto p-3 flex flex-col sm:flex-row gap-3">
      {properties.map((property: Property) => (
        <PropertyCard property={property} />
      ))}
    </div>
  )
}
