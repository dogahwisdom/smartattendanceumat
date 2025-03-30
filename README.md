# UMaT Smart Attendance System

A modern attendance management system for University of Mines and Technology (UMaT) with multiple verification methods including QR code scanning, facial recognition, NFC, and geofencing.

## Features

- **Multiple Attendance Methods**:
  - QR Code Scanning
  - Facial Recognition
  - NFC Card Verification
  - Geolocation Verification

- **User Roles**:
  - Students: Mark attendance, view attendance history
  - Lecturers: Generate attendance QR codes, view reports
  - Administrators: Manage users, courses, and system settings

- **Comprehensive Analytics**:
  - Attendance trends and patterns
  - Course-specific reports
  - Student performance insights

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Chart.js for data visualization
  - React Router for navigation

- **Backend**:
  - Node.js with Express
  - SQLite database (easy to set up, no external dependencies)
  - JWT for authentication

- **Features**:
  - TensorFlow.js for facial recognition
  - HTML5 Geolocation API
  - QR code generation and scanning

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/umat-smart-attendance.git
cd umat-smart-attendance
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. In a separate terminal, start the backend server
```bash
npm run server
```

### Demo Accounts

For testing purposes, the following demo accounts are available:

- **Student**:
  - Email: student@umat.edu.gh
  - Password: password

- **Lecturer**:
  - Email: lecturer@umat.edu.gh
  - Password: password

- **Admin**:
  - Email: admin@umat.edu.gh
  - Password: password

## Project Structure

```
umat-smart-attendance/
├── public/              # Static assets
├── server/              # Backend server code
│   ├── index.js         # Express server setup
│   └── database.sqlite  # SQLite database file (created on first run)
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Deployment

### Frontend

The frontend can be built for production using:

```bash
npm run build
```

This will create a `dist` directory with optimized production build.

### Backend

For production deployment, consider:
- Using a production-grade database like PostgreSQL or MySQL
- Setting up proper environment variables
- Implementing additional security measures

## License

This project is licensed under the MIT License - see the LICENSE file for details.