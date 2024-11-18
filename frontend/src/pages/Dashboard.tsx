import { useEffect, useState } from 'react';
import { Property } from '../../../shared/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import { useAppContext } from '@/context/AppContext';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reverseProvinceMapping } from "@/constants/provinceMapping";
import { ProvinceSelect } from '@/components/ProvinceSelect';

export const Dashboard = () => {
  const { user, properties, setProperties } = useAppContext();

  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("All");

  useEffect(() => {
    // Fetch Properties
    const fetchProperties = async () => {
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
          setFilteredProperties(filteredData);
        } else {
          setProperties(data.properties);
          setFilteredProperties(data.properties);
        }
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    fetchProperties();
  }, [setProperties, user]);

  useEffect(() => {
    let sortedAndFiltered = [...properties];

    // Filter by city
    if (city.trim()) {
      sortedAndFiltered = sortedAndFiltered.filter((property) =>
        property.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by province
    if (province !== "All") {
      sortedAndFiltered = sortedAndFiltered.filter((property) => {
        const propertyProvince = reverseProvinceMapping[property.province] || property.province;
        return propertyProvince.toLowerCase() === province.toLowerCase();
      });
    }

    // Sort by selected key
    sortedAndFiltered.sort((a, b) => {
      if (sortKey === "rent") {
        // Ascending sort for rent
        return a[sortKey] - b[sortKey];
      } else if (sortKey === "createdAt" || sortKey === "updatedAt") {
        // Descending sort for dates
        return new Date(b[sortKey]).getTime() - new Date(a[sortKey]).getTime();
      }
      return 0;
    });

    setFilteredProperties(sortedAndFiltered);
  }, [city, province, sortKey, properties]);

  return (
    <div className="w-full max-w-screen-xl mx-auto p-3 flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center gap-3">

        {/* Sort Dropdown */}
        <Select onValueChange={setSortKey} value={sortKey}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="updatedAt">Updated At</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>

        {/* City Input */}
        <Input
          type="text"
          placeholder="Filter by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full sm:w-48"
        />

        {/* Province Select */}
        <ProvinceSelect
          value={province}
          className="w-full sm:w-48"
          onChange={setProvince}
          hasAll={true}
        />
      </div>

      {/* Property Cards */}
      {filteredProperties.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <span className='mt-12 text-2xl font-semibold'>No Properties Found</span>
        </div>
      )}
    </div>
  );
};
