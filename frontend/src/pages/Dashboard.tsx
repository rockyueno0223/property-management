import { useEffect } from 'react';
import { Property } from '../../../shared/types/property'
import { PropertyCard } from '@/components/PropertyCard';
import { useAppContext } from '@/context/AppContext';

export const Dashboard = () => {
  const { user, properties, setProperties } = useAppContext();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch('http://localhost:3500/api/properties');
        const data = await res.json();
        if (data.success === false) {
          console.error(data.message);
          return;
        }
        if (user?.accountType === 'owner') {
          const filteredData = data.properties.filter((property: Property) => property.ownerId === user?.id);
          setProperties(filteredData);
        } else {
          setProperties(data.properties);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    }
    fetchProperty();
  }, [setProperties, user]);

  return (
    <div className="w-full max-w-screen-xl mx-auto p-3 flex flex-col sm:flex-row gap-3">
      {properties.map((property: Property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
