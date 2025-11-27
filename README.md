# Ambulance Jamii - Emergency Medical Services Platform

A comprehensive MERN stack web application for streamlining emergency ambulance requests, dispatching, hospital availability management, and analytics reporting.

## 🚑 Features

### Core Functionality
- **Emergency Request Portal**: Public interface for requesting ambulances with geolocation
- **Dispatch Management**: Real-time dashboard for emergency operators
- **Driver Interface**: Mobile-optimized interface for ambulance drivers
- **Hospital Dashboard**: Capacity management and availability tracking
- **Analytics & Reporting**: Comprehensive performance metrics and insights

### Technical Features
- **Real-time Communication**: WebSocket integration for live updates
- **Role-based Access Control**: Multi-user authentication system
- **Geolocation Services**: Google Maps integration for location tracking
- **Payment Processing**: Stripe integration for premium services
- **Responsive Design**: Mobile-first approach with desktop optimization
- **RESTful API**: Comprehensive backend API with proper error handling

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Query** - Data fetching and caching
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Leaflet** - Maps integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands

## 📁 Project Structure

```
ambulance-jamii/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── socket/            # Socket.io handlers
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main App component
│   ├── public/            # Static assets
│   └── index.html         # HTML template
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ambulance-jamii.git
   cd ambulance-jamii
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   npm run install-server
   
   # Install client dependencies
   npm run install-client
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/.env.example server/.env
   ```

4. **Configure Environment Variables**
   Edit `server/.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ambulance_jamii
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Stripe (Optional)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   
   # Google Maps (Optional)
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Email (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

5. **Start the Application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 👥 User Roles & Access

### Public Users
- Submit emergency requests
- Track ambulance status
- View estimated arrival times

### Dispatchers
- View all emergency requests
- Assign ambulances to emergencies
- Monitor fleet status
- Access analytics dashboard

### Drivers
- Receive emergency assignments
- Update status and location
- Navigate to emergency locations
- Communicate with dispatch

### Hospital Administrators
- Manage bed availability
- Update ER status
- View incoming patients
- Coordinate with dispatch

### Analytics Administrators
- Access comprehensive reports
- View performance metrics
- Export data for analysis
- Monitor system health

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Emergency Management
- `POST /api/emergency` - Create emergency request
- `GET /api/emergency` - Get all emergencies
- `GET /api/emergency/:id` - Get emergency by ID
- `PUT /api/emergency/:id/assign` - Assign ambulance
- `PUT /api/emergency/:id/status` - Update status

### Ambulance Management
- `GET /api/ambulance` - Get all ambulances
- `GET /api/ambulance/:id` - Get ambulance by ID
- `PUT /api/ambulance/:id/location` - Update location
- `PUT /api/ambulance/:id/status` - Update status

### Hospital Management
- `GET /api/hospital` - Get all hospitals
- `GET /api/hospital/:id` - Get hospital by ID
- `PUT /api/hospital/:id/capacity` - Update capacity
- `PUT /api/hospital/:id/status` - Update ER status

### Analytics
- `GET /api/analytics/overview` - System overview
- `GET /api/analytics/response-times` - Response time metrics
- `GET /api/analytics/hospital-load` - Hospital capacity data

## 🧪 Testing

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run all tests
npm run test
```

## 📦 Deployment

### Production Build
```bash
# Build client for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ambulance_jamii
CLIENT_URL=https://your-domain.com
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ambulancejamii.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- Emergency medical services professionals for their insights
- Open source community for the amazing tools and libraries
- Healthcare technology innovators for inspiration

---

**Ambulance Jamii** - Saving lives through technology 🚑❤️