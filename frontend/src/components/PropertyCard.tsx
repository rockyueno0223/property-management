import { Property } from "../../../shared/types/property"

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border">
      <img
        src={property.imageUrl}
        alt={property.title}
        className="w-full h-48 sm:h-40 object-cover"
      />
      <div className="p-3 flex flex-col gap-2">
        <p className="leading-4">{property.title}</p>
        <div className="flex flex-row justify-between items-end">
          <p className="text-red-500 font-semibold">${property.rent}</p>
          <p className="text-sm text-gray-500">{property.city} {property.province}</p>
        </div>
      </div>
    </div>
  )
}