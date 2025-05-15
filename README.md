# ENTNT Ship Maintenance website
## Features

- **User Authentication**
  - Role-based access control (Admin, Inspector, Engineer)
  - Secure login with email/password
  - Session persistence using localStorage

- **Ships Management**
  - CRUD operations for ships
  - Detailed ship profiles
  - Component tracking
  - Maintenance history

- **Components Management**
  - Add/Edit/Delete ship components
  - Track installation and maintenance dates
  - Component-specific maintenance jobs

- **Maintenance Jobs**
  - Create and assign maintenance tasks
  - Priority-based job scheduling
  - Status tracking and updates
  - Calendar view for scheduled maintenance

- **Dashboard & Analytics**
  - Real-time KPI monitoring
  - Maintenance status overview
  - Interactive charts and statistics
  - Overdue maintenance alerts

- **Notification System**
  - Real-time maintenance alerts
  - Job status updates
  - Dismissible notifications
  - Unread notification tracking

## Tech Stack

- React 18.3
- JavaScript
- Tailwind CSS
- React Router v6
- Context API for state management
- Lucide React for icons
- Vite for build tooling

## Getting Started
### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com//entnt-ship-maintenance.git
   ```

2. Install dependencies:
   ```bash
   cd entnt-ship-maintenance
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Demo Accounts
Admin: admin@entnt.com / Admin@2024
Inspector: inspector@entnt.com / Inspect@2024
Engineer: engineer@entnt.com / Engineer@2024

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Authentication/  # Login and auth components
│   ├── Dashboard/      # Dashboard widgets and charts
│   ├── Ships/          # Ship management components
│   ├── Components/     # Component management
│   ├── Jobs/           # Maintenance job components
│   └── Notifications/  # Notification system
├── contexts/           # React Context providers
├── pages/              # Page components
├── utils/              # Utility functions
└── types/              # Javascript types
```

## List of Known Issues or Limitations
**Role Management**: Currently, role management is basic and may require enhancements for more complex user roles.
**LocalStorage Limitations**: Data persistence is reliant on localStorage, which may not be suitable for larger datasets.
**Responsive Design**: While the application is styled with Tailwind CSS, some components may require additional adjustments for better responsiveness on smaller devices.

## Architecture

The application follows a component-based architecture with the following key aspects:

- **State Management**: Uses React Context API for global state management
- **Data Persistence**: Implements localStorage for data persistence
- **Component Hierarchy**: Follows a modular component structure
- **Role-based Access**: Implements permission-based feature access
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Technical Decisions

1. **React Context over Redux**
   - Simpler state management for medium-scale application
   - Reduced boilerplate code
   - Built-in React feature requiring no additional dependencies

2. **Tailwind CSS**
   - Rapid UI development
   - Consistent styling system
   - Excellent responsive design support
   - Small bundle size with purge CSS

3. **JavaScript**
   - Enhanced code maintainability
   - Better IDE support and code documentation

4. **Vite**
   - Fast development server
   - Quick build times
   - Modern development experience
**WebsiteLink**
https://shipment-managment-website.vercel.app/login
**contact**
 - MailId:reddyrk31@gmail.com
