const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected with role: ${socket.user.role}`);

    // Join role-specific rooms
    socket.join(socket.user.role);
    if (socket.user.role === 'driver' && socket.user.profile.ambulanceId) {
      socket.join(`ambulance_${socket.user.profile.ambulanceId}`);
    }
    if (socket.user.role === 'hospital_admin' && socket.user.profile.hospitalId) {
      socket.join(`hospital_${socket.user.profile.hospitalId}`);
    }

    // Handle location updates from drivers
    socket.on('location_update', (data) => {
      if (socket.user.role === 'driver') {
        // Broadcast location to dispatchers
        socket.to('dispatcher').emit('driver_location_update', {
          driverId: socket.user.id,
          ambulanceId: socket.user.profile.ambulanceId,
          location: data.location,
          timestamp: new Date()
        });
      }
    });

    // Handle emergency status updates
    socket.on('emergency_status_update', (data) => {
      // Broadcast to all relevant parties
      io.emit('emergency_status_updated', {
        emergencyId: data.emergencyId,
        status: data.status,
        updatedBy: socket.user.id,
        timestamp: new Date()
      });
    });

    // Handle hospital capacity updates
    socket.on('hospital_capacity_update', (data) => {
      if (socket.user.role === 'hospital_admin') {
        // Broadcast to dispatchers
        socket.to('dispatcher').emit('hospital_capacity_updated', {
          hospitalId: socket.user.profile.hospitalId,
          capacity: data.capacity,
          updatedBy: socket.user.id,
          timestamp: new Date()
        });
      }
    });

    // Handle chat messages
    socket.on('send_message', (data) => {
      const message = {
        id: Date.now(),
        senderId: socket.user.id,
        senderName: socket.user.name,
        senderRole: socket.user.role,
        message: data.message,
        timestamp: new Date(),
        emergencyId: data.emergencyId
      };

      // Send to specific emergency participants
      if (data.emergencyId) {
        socket.to(`emergency_${data.emergencyId}`).emit('new_message', message);
      }
    });

    // Join emergency-specific room
    socket.on('join_emergency', (emergencyId) => {
      socket.join(`emergency_${emergencyId}`);
    });

    // Leave emergency-specific room
    socket.on('leave_emergency', (emergencyId) => {
      socket.leave(`emergency_${emergencyId}`);
    });

    // Handle driver availability updates
    socket.on('driver_availability', (data) => {
      if (socket.user.role === 'driver') {
        socket.to('dispatcher').emit('driver_availability_updated', {
          driverId: socket.user.id,
          ambulanceId: socket.user.profile.ambulanceId,
          isAvailable: data.isAvailable,
          timestamp: new Date()
        });
      }
    });

    // Handle emergency alerts
    socket.on('emergency_alert', (data) => {
      if (socket.user.role === 'dispatcher') {
        // Send alert to all drivers
        socket.to('driver').emit('emergency_alert', {
          message: data.message,
          severity: data.severity,
          location: data.location,
          timestamp: new Date()
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.name} disconnected`);
      
      // Notify relevant parties about driver going offline
      if (socket.user.role === 'driver') {
        socket.to('dispatcher').emit('driver_offline', {
          driverId: socket.user.id,
          ambulanceId: socket.user.profile.ambulanceId,
          timestamp: new Date()
        });
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Broadcast system-wide notifications
  const broadcastSystemNotification = (notification) => {
    io.emit('system_notification', {
      ...notification,
      timestamp: new Date()
    });
  };

  // Broadcast emergency alerts to specific roles
  const broadcastEmergencyAlert = (alert, roles = ['dispatcher', 'driver']) => {
    roles.forEach(role => {
      io.to(role).emit('emergency_alert', {
        ...alert,
        timestamp: new Date()
      });
    });
  };

  // Export functions for use in other parts of the application
  return {
    broadcastSystemNotification,
    broadcastEmergencyAlert
  };
};

module.exports = socketHandler;