import { createContext, useContext } from 'react';
import { User } from '../../../shared/types/user';
import { Property } from '../../../shared/types/property';

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
