import { useEffect } from 'react';
import { Property } from '../../../shared/types/property'
import { PropertyCard } from '@/components/PropertyCard';
import { useAppContext } from '@/context/AppContext';

export const Dashboard = () => {
  const { properties, setProperties } = useAppContext();

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
  }, [setProperties]);

  return (
    <div className="w-full max-w-screen-xl mx-auto p-3 flex flex-col sm:flex-row gap-3">
      {properties.map((property: Property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
