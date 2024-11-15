import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface MapComponentProps {
  address: string; // Full address (ex. 123 Main St, State, Province)
}

export const MapComponent: React.FC<MapComponentProps> = ({ address }) => {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeocode = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setCoordinates({ lat: location.lat, lng: location.lng });
        } else {
          setError(`Failed to geocode address: ${data.status}`);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        setError('An error occurred while fetching coordinates.');
      }
    };

    fetchGeocode();
  }, [address]);

  return (
    coordinates ? (
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          style={{ width: '100%', height: '400px' }}
          defaultCenter={coordinates}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          <Marker position={coordinates} />
        </Map>
      </APIProvider>
    ) : (
      <div>
        {error ? (
          <span className='text-red-500'>{error}</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    )
  );
};
