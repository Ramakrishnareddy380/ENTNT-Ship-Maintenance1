/**
 * @typedef {Object} User
 * @property {string} id
 * @property {'Admin'|'Inspector'|'Engineer'} role
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} Ship
 * @property {string} id
 * @property {string} name
 * @property {string} imo
 * @property {string} flag
 * @property {'Active'|'Under Maintenance'|'Out of Service'} status
 */

/**
 * @typedef {Object} Component
 * @property {string} id
 * @property {string} shipId
 * @property {string} name
 * @property {string} serialNumber
 * @property {string} installDate
 * @property {string} lastMaintenanceDate
 */

/**
 * @typedef {Object} Job
 * @property {string} id
 * @property {string} componentId
 * @property {string} shipId
 * @property {'Inspection'|'Repair'|'Replacement'|'Overhaul'} type
 * @property {'Low'|'Medium'|'High'|'Critical'} priority
 * @property {'Open'|'In Progress'|'Completed'|'Cancelled'} status
 * @property {string} assignedEngineerId
 * @property {string} scheduledDate
 * @property {string} [completedDate]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {'JobCreated'|'JobUpdated'|'JobCompleted'} type
 * @property {string} message
 * @property {string} timestamp
 * @property {boolean} read
 * @property {string} [jobId]
 */

/**
 * @typedef {Object} AppState
 * @property {User[]} users
 * @property {Ship[]} ships
 * @property {Component[]} components
 * @property {Job[]} jobs
 * @property {Notification[]} notifications
 */

export {}; 