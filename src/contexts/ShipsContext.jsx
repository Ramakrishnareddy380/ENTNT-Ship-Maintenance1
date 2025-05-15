import React, { createContext, useContext, useEffect, useState } from 'react';
import { getShips, addShip, updateShip, deleteShip, initializeData } from '../utils/localStorageUtils';

/**
 * @typedef {Object} ShipsContextType
 * @property {import('../types').Ship[]} ships
 * @property {boolean} loading
 * @property {string|null} error
 * @property {function(import('../types').Ship): Promise<import('../types').Ship>} addShip
 * @property {function(import('../types').Ship): Promise<import('../types').Ship>} updateShip
 * @property {function(string): Promise<void>} deleteShip
 * @property {function(): void} refreshShips
 */

const ShipsContext = createContext(undefined);

/**
 * Provider component for ships context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const ShipsProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data and load ships
  useEffect(() => {
    const loadShips = async () => {
      try {
        initializeData(); // Initialize localStorage if empty
        const shipData = getShips();
        setShips(shipData);
      } catch (err) {
        setError('Failed to load ships');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadShips();
  }, []);

  // Add a new ship
  const addShipHandler = async (shipData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newShip = addShip(shipData);
      setShips(prevShips => [...prevShips, newShip]);
      return newShip;
    } catch (err) {
      setError('Failed to add ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing ship
  const updateShipHandler = async (shipData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedShip = updateShip(shipData);
      setShips(prevShips => 
        prevShips.map(ship => ship.id === updatedShip.id ? updatedShip : ship)
      );
      return updatedShip;
    } catch (err) {
      setError('Failed to update ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a ship
  const deleteShipHandler = async (id) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteShip(id);
      setShips(prevShips => prevShips.filter(ship => ship.id !== id));
    } catch (err) {
      setError('Failed to delete ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh ships data
  const refreshShips = () => {
    try {
      const shipData = getShips();
      setShips(shipData);
    } catch (err) {
      setError('Failed to refresh ships');
      console.error(err);
    }
  };

  return (
    <ShipsContext.Provider value={{
      ships,
      loading,
      error,
      addShip: addShipHandler,
      updateShip: updateShipHandler,
      deleteShip: deleteShipHandler,
      refreshShips
    }}>
      {children}
    </ShipsContext.Provider>
  );
};

/**
 * Hook to use the ships context
 * @returns {ShipsContextType}
 */
export const useShips = () => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
}; 