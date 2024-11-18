import { useAppContext } from "@/context/AppContext";
import { Property } from "../../../shared/types/property"
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { user } = useAppContext();

  return (
    <div className="w-full border">
      <img
        src={property.imageUrl || ''}
        alt={property.title}
        className="w-full h-48 sm:h-40 object-cover"
      />
      <div className="p-3 flex flex-col gap-2">
        <p className="font-semibold leading-4">{property.title}</p>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row justify-between items-end">
            <p className="text-red-500 font-semibold">${property.rent}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{property.city} {property.province}</p>
          </div>
          <Link to={user?.accountType === 'resident' ? `/dashboard/${property.id}` : `/dashboard/${property.id}/edit`}>
            <Button>
              {user?.accountType === 'resident' ? 'Show detail' : 'Update'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
