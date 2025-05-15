import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Anchor, Calendar, PenTool as Tool, Clipboard, Edit, ArrowLeft, Plus } from 'lucide-react';
import { useShips } from '../../contexts/ShipsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { getShipById } from '../../utils/localStorageUtils';

const ShipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshShips } = useShips();
  const { components, getComponentsByShipId, refreshComponents } = useComponents();
  const { jobs, getJobsByShipId, refreshJobs } = useJobs();
  const { user } = useAuth();
  
  const [ship, setShip] = useState(null);
  const [shipComponents, setShipComponents] = useState([]);
  const [shipJobs, setShipJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  const canEditShip = hasPermission(user, 'canEditShip');
  const canCreateComponent = hasPermission(user, 'canCreateComponent');
  const canCreateJob = hasPermission(user, 'canCreateJob');

  useEffect(() => {
    const loadShipData = () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const shipData = getShipById(id);
        if (shipData) {
          setShip(shipData);
          setShipComponents(getComponentsByShipId(id));
          setShipJobs(getJobsByShipId(id));
        } else {
          navigate('/ships');
        }
      } catch (err) {
        console.error('Error loading ship data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShipData();
    
    // Refresh data from context providers
    refreshShips();
    refreshComponents();
    refreshJobs();
  }, [id, navigate, refreshShips, refreshComponents, refreshJobs, getComponentsByShipId, getJobsByShipId]);

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Service':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Status badge styling for jobs
  const getJobStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Priority badge styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!ship) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Ship not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/ships')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Anchor className="mr-2 text-blue-600" size={24} />
              {ship.name}
            </h2>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <span>IMO: {ship.imo}</span>
              <span className="mx-2">•</span>
              <span>Flag: {ship.flag}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeClass(ship.status)}`}>
                {ship.status}
              </span>
            </div>
          </div>
        </div>
        
        {canEditShip && (
          <Link
            to={`/ships/edit/${ship.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit size={16} className="mr-2" />
            Edit Ship
          </Link>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('general')}
            >
              <Clipboard size={16} className="mr-2" />
              General Information
            </button>
            <button
              className={`${
                activeTab === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('components')}
            >
              <Tool size={16} className="mr-2" />
              Components
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {shipComponents.length}
              </span>
            </button>
            <button
              className={`${
                activeTab === 'maintenance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('maintenance')}
            >
              <Calendar size={16} className="mr-2" />
              Maintenance History
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {shipJobs.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Ship Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">IMO Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.imo}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Flag</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.flag}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(ship.status)}`}>
                        {ship.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Summary</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Components</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipComponents.length}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Maintenance Jobs</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipJobs.length}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Open Jobs</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipJobs.filter(job => job.status === 'Open').length}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Components</h3>
                {canCreateComponent && (
                  <Link
                    to={`/components/new/${ship.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Component
                  </Link>
                )}
              </div>
              
              {shipComponents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No components found for this ship.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {shipComponents.map((component) => (
                    <div
                      key={component.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <h4 className="font-medium text-gray-900">{component.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Serial: {component.serialNumber}</p>
                      <div className="mt-2 text-sm">
                        <p>Install Date: {new Date(component.installDate).toLocaleDateString()}</p>
                        <p>Last Maintenance: {new Date(component.lastMaintenanceDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Maintenance History</h3>
                {canCreateJob && (
                  <Link
                    to={`/jobs/new/${ship.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus size={16} className="mr-1" />
                    Create Job
                  </Link>
                )}
              </div>
              
              {shipJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No maintenance jobs found for this ship.
                </div>
              ) : (
                <div className="space-y-4">
                  {shipJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{job.type}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Component: {shipComponents.find(c => c.id === job.componentId)?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getJobStatusBadgeClass(job.status)}`}>
                            {job.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeClass(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</p>
                        {job.assignedEngineerId && (
                          <p>Assigned to: {job.assignedEngineerId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipDetail; 