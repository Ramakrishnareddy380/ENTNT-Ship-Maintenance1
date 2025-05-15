const STORAGE_KEY = 'entnt_shipMaintenance';

// Initial mock data
const initialData = {
  users: [
    { id: '1', role: 'Admin', email: 'admin@entnt.com', password: 'Admin@2024' },
    { id: '2', role: 'Inspector', email: 'inspector@entnt.com', password: 'Inspect@2024' },
    { id: '3', role: 'Engineer', email: 'engineer@entnt.com', password: 'Engineer@2024' }
  ],
  ships: [
    { id: 's1', name: 'Ever Given', imo: '9811000', flag: 'Panama', status: 'Active' },
    { id: 's2', name: 'Maersk Alabama', imo: '9164263', flag: 'USA', status: 'Under Maintenance' }
  ],
  components: [
    { 
      id: 'c1', 
      shipId: 's1', 
      name: 'Main Engine', 
      serialNumber: 'ME-1234', 
      installDate: '2020-01-10', 
      lastMaintenanceDate: '2024-03-12' 
    },
    { 
      id: 'c2', 
      shipId: 's2', 
      name: 'Radar', 
      serialNumber: 'RAD-5678', 
      installDate: '2021-07-18', 
      lastMaintenanceDate: '2023-12-01' 
    }
  ],
  jobs: [
    { 
      id: 'j1', 
      componentId: 'c1', 
      shipId: 's1', 
      type: 'Inspection', 
      priority: 'High', 
      status: 'Open', 
      assignedEngineerId: '3', 
      scheduledDate: '2025-05-05' 
    }
  ],
  notifications: [
    {
      id: 'n1',
      type: 'JobCreated',
      message: 'New inspection job created for Main Engine on Ever Given',
      timestamp: new Date().toISOString(),
      read: false,
      jobId: 'j1'
    }
  ]
};

// Initialize data in localStorage if it doesn't exist
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// Get all data from localStorage
export const getAllData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
};

// Save all data to localStorage
export const saveAllData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// User-related functions
export const getUsers = () => {
  return getAllData().users;
};

export const getUserById = (id) => {
  return getUsers().find(user => user.id === id);
};

export const authenticateUser = (email, password) => {
  const user = getUsers().find(u => u.email === email && u.password === password);
  return user || null;
};

// Ship-related functions
export const getShips = () => {
  return getAllData().ships;
};

export const getShipById = (id) => {
  return getShips().find(ship => ship.id === id);
};

export const addShip = (ship) => {
  const data = getAllData();
  const newShip = { ...ship, id: `s${Date.now()}` };
  data.ships.push(newShip);
  saveAllData(data);
  return newShip;
};

export const updateShip = (updatedShip) => {
  const data = getAllData();
  data.ships = data.ships.map(ship => 
    ship.id === updatedShip.id ? updatedShip : ship
  );
  saveAllData(data);
  return updatedShip;
};

export const deleteShip = (id) => {
  const data = getAllData();
  data.ships = data.ships.filter(ship => ship.id !== id);
  // Also delete related components and jobs
  data.components = data.components.filter(component => component.shipId !== id);
  data.jobs = data.jobs.filter(job => job.shipId !== id);
  saveAllData(data);
};

// Component-related functions
export const getComponents = () => {
  return getAllData().components;
};

export const getComponentsByShipId = (shipId) => {
  return getComponents().filter(component => component.shipId === shipId);
};

export const getComponentById = (id) => {
  return getComponents().find(component => component.id === id);
};

export const addComponent = (component) => {
  const data = getAllData();
  const newComponent = { ...component, id: `c${Date.now()}` };
  data.components.push(newComponent);
  saveAllData(data);
  return newComponent;
};

export const updateComponent = (updatedComponent) => {
  const data = getAllData();
  data.components = data.components.map(component => 
    component.id === updatedComponent.id ? updatedComponent : component
  );
  saveAllData(data);
  return updatedComponent;
};

export const deleteComponent = (id) => {
  const data = getAllData();
  data.components = data.components.filter(component => component.id !== id);
  // Also delete related jobs
  data.jobs = data.jobs.filter(job => job.componentId !== id);
  saveAllData(data);
};

// Job-related functions
export const getJobs = () => {
  return getAllData().jobs;
};

export const getJobsByShipId = (shipId) => {
  return getJobs().filter(job => job.shipId === shipId);
};

export const getJobsByComponentId = (componentId) => {
  return getJobs().filter(job => job.componentId === componentId);
};

export const getJobById = (id) => {
  return getJobs().find(job => job.id === id);
};

export const addJob = (job) => {
  const data = getAllData();
  const newJob = { ...job, id: `j${Date.now()}` };
  data.jobs.push(newJob);
  
  // Create notification
  const component = getComponentById(job.componentId);
  const ship = getShipById(job.shipId);
  if (component && ship) {
    addNotification({
      type: 'JobCreated',
      message: `New ${job.type.toLowerCase()} job created for ${component.name} on ${ship.name}`,
      timestamp: new Date().toISOString(),
      read: false,
      jobId: newJob.id
    });
  }
  
  saveAllData(data);
  return newJob;
};

export const updateJob = (updatedJob) => {
  const data = getAllData();
  const oldJob = data.jobs.find(job => job.id === updatedJob.id);
  
  data.jobs = data.jobs.map(job => 
    job.id === updatedJob.id ? updatedJob : job
  );
  saveAllData(data);
  
  // Create notification if status changed
  if (oldJob && oldJob.status !== updatedJob.status) {
    const component = getComponentById(updatedJob.componentId);
    const ship = getShipById(updatedJob.shipId);
    
    if (component && ship) {
      const notificationType = updatedJob.status === 'Completed' ? 'JobCompleted' : 'JobUpdated';
      const message = updatedJob.status === 'Completed' 
        ? `${updatedJob.type} job for ${component.name} on ${ship.name} has been completed`
        : `${updatedJob.type} job for ${component.name} on ${ship.name} status updated to ${updatedJob.status}`;
      
      addNotification({
        type: notificationType,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        jobId: updatedJob.id
      });
      
      // Update component last maintenance date if job is completed
      if (updatedJob.status === 'Completed' && component) {
        const currentDate = new Date().toISOString().split('T')[0];
        updateComponent({
          ...component,
          lastMaintenanceDate: currentDate
        });
      }
    }
  }
  
  return updatedJob;
};

export const deleteJob = (id) => {
  const data = getAllData();
  data.jobs = data.jobs.filter(job => job.id !== id);
  saveAllData(data);
};

// Notification-related functions
export const getNotifications = () => {
  return getAllData().notifications;
};

export const getUnreadNotificationsCount = () => {
  return getNotifications().filter(n => !n.read).length;
};

export const addNotification = (notification) => {
  const data = getAllData();
  const newNotification = { ...notification, id: `n${Date.now()}` };
  data.notifications.push(newNotification);
  saveAllData(data);
  return newNotification;
};

export const markNotificationAsRead = (id) => {
  const data = getAllData();
  data.notifications = data.notifications.map(notification =>
    notification.id === id ? { ...notification, read: true } : notification
  );
  saveAllData(data);
};

export const markAllNotificationsAsRead = () => {
  const data = getAllData();
  data.notifications = data.notifications.map(notification => ({ ...notification, read: true }));
  saveAllData(data);
};

export const deleteNotification = (id) => {
  const data = getAllData();
  data.notifications = data.notifications.filter(notification => notification.id !== id);
  saveAllData(data);
};

// Dashboard statistics
export const getShipCount = () => {
  return getShips().length;
};

export const getOverdueMaintenanceCount = () => {
  const today = new Date();
  return getComponents().filter(component => {
    const lastMaintenance = new Date(component.lastMaintenanceDate);
    const monthsSinceLastMaintenance = (today - lastMaintenance) / (1000 * 60 * 60 * 24 * 30);
    return monthsSinceLastMaintenance > 6; // Consider maintenance overdue after 6 months
  }).length;
};

export const getJobsInProgressCount = () => {
  return getJobs().filter(job => job.status === 'In Progress').length;
};

export const getCompletedJobsCount = () => {
  return getJobs().filter(job => job.status === 'Completed').length;
};

export const getJobsForDate = (date) => {
  return getJobs().filter(job => job.scheduledDate === date);
}; 