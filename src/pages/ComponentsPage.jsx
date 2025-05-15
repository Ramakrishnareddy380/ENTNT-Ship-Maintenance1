import React from 'react';
import ComponentList from '../components/Components/ComponentList';

const ComponentsPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          Components
        </h2>
        <p className="text-gray-600 mt-1">
          List of all ship components in the system
        </p>
      </div>
      <ComponentList />
    </div>
  );
};

export default ComponentsPage; 