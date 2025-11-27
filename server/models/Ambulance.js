const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  callSign: {
    type: String,
    required: [true, 'Call sign is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'Call sign must contain only letters, numbers, and hyphens']
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true
  },
  type: {
    type: String,
    required: [true, 'Ambulance type is required'],
    enum: ['basic', 'advanced', 'critical_care', 'air_ambulance'],
    default: 'basic'
  },
  status: {
    type: String,
    enum: ['available', 'dispatched', 'busy', 'maintenance', 'offline'],
    default: 'available'
  },
  currentLocation: {
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  baseStation: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedParamedic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  currentEmergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  },
  equipment: [{
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'broken'],
      default: 'operational'
    },
    lastChecked: {
      type: Date,
      default: Date.now
    },
    expiryDate: Date
  }],
  specifications: {
    make: String,
    model: String,
    year: Number,
    licensePlate: String,
    capacity: {
      type: Number,
      default: 2
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      default: 'diesel'
    }
  },
  maintenance: [{
    type: {
      type: String,
      enum: ['routine', 'repair', 'inspection', 'emergency']
    },
    description: String,
    scheduledDate: Date,
    completedDate: Date,
    cost: Number,
    performedBy: String,
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  performance: {
    totalDistance: {
      type: Number,
      default: 0
    },
    totalEmergencies: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    fuelConsumption: {
      type: Number,
      default: 0
    },
    lastServiceDate: Date,
    nextServiceDue: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update location method
ambulanceSchema.methods.updateLocation = function(latitude, longitude, address) {
  this.currentLocation = {
    coordinates: { latitude, longitude },
    address: address || this.currentLocation.address,
    lastUpdated: new Date()
  };
  return this.save();
};

// Check if ambulance is available for assignment
ambulanceSchema.methods.isAvailableForAssignment = function() {
  return this.status === 'available' && this.isActive && this.assignedDriver;
};

// Calculate distance from a point
ambulanceSchema.methods.distanceFrom = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.currentLocation.coordinates.latitude) * Math.PI / 180;
  const dLon = (longitude - this.currentLocation.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.currentLocation.coordinates.latitude * Math.PI / 180) *
    Math.cos(latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Indexes
ambulanceSchema.index({ status: 1 });
ambulanceSchema.index({ 'currentLocation.coordinates': '2dsphere' });
ambulanceSchema.index({ assignedDriver: 1 });
ambulanceSchema.index({ type: 1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);