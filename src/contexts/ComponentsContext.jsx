import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getComponents, 
  getComponentsByShipId,
  addComponent, 
  updateComponent, 
  deleteComponent 
} from '../utils/localStorageUtils';

/**
 * @typedef {Object} ComponentsContextType
 * @property {import('../types').Component[]} components
 * @property {boolean} loading
 * @property {string|null} error
 * @property {function(string): import('../types').Component[]} getComponentsByShipId
 * @property {function(import('../types').Component): Promise<import('../types').Component>} addComponent
 * @property {function(import('../types').Component): Promise<import('../types').Component>} updateComponent
 * @property {function(string): Promise<void>} deleteComponent
 * @property {function(): void} refreshComponents
 */

const ComponentsContext = createContext(undefined);

/**
 * Provider component for components context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load components
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const componentData = getComponents();
        setComponents(componentData);
      } catch (err) {
        setError('Failed to load components');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  // Get components by ship ID
  const getComponentsByShipIdHandler = (shipId) => {
    return getComponentsByShipId(shipId);
  };

  // Add a new component
  const addComponentHandler = async (componentData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComponent = addComponent(componentData);
      setComponents(prevComponents => [...prevComponents, newComponent]);
      return newComponent;
    } catch (err) {
      setError('Failed to add component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing component
  const updateComponentHandler = async (componentData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedComponent = updateComponent(componentData);
      setComponents(prevComponents => 
        prevComponents.map(component => component.id === updatedComponent.id ? updatedComponent : component)
      );
      return updatedComponent;
    } catch (err) {
      setError('Failed to update component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a component
  const deleteComponentHandler = async (id) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteComponent(id);
      setComponents(prevComponents => prevComponents.filter(component => component.id !== id));
    } catch (err) {
      setError('Failed to delete component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh components data
  const refreshComponents = () => {
    try {
      const componentData = getComponents();
      setComponents(componentData);
    } catch (err) {
      setError('Failed to refresh components');
      console.error(err);
    }
  };

  return (
    <ComponentsContext.Provider value={{
      components,
      loading,
      error,
      getComponentsByShipId: getComponentsByShipIdHandler,
      addComponent: addComponentHandler,
      updateComponent: updateComponentHandler,
      deleteComponent: deleteComponentHandler,
      refreshComponents
    }}>
      {children}
    </ComponentsContext.Provider>
  );
};

/**
 * Hook to use the components context
 * @returns {ComponentsContextType}
 */
export const useComponents = () => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
}; 