import React, { useState } from 'react';
import { AppContext } from './AppContext';
import { User } from '../../../shared/types/user';
import { Property } from '../../../shared/types/property';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  return (
    <AppContext.Provider value={{ user, setUser, properties, setProperties }}>
      {children}
    </AppContext.Provider>
  );
};
