import React, { useEffect, useState } from 'react';
import { AppContext } from './AppContext';
import { User } from '../../../shared/types/user';
import { Property } from '../../../shared/types/property';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user])

  return (
    <AppContext.Provider value={{ user, setUser, properties, setProperties }}>
      {children}
    </AppContext.Provider>
  );
};
