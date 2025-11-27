const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    medicalHistory: String
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    landmark: String
  },
  emergencyType: {
    type: String,
    required: [true, 'Emergency type is required'],
    enum: [
      'cardiac_emergency',
      'accident',
      'respiratory_emergency',
      'stroke',
      'trauma',
      'allergic_reaction',
      'pregnancy',
      'psychiatric',
      'other'
    ]
  },
  severityLevel: {
    type: String,
    required: [true, 'Severity level is required'],
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: [
      'pending',
      'assigned',
      'dispatched',
      'en_route',
      'arrived',
      'patient_loaded',
      'en_route_hospital',
      'arrived_hospital',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  assignedAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDispatcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  destinationHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      latitude: Number,
      longitude: Number
    },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  estimatedArrival: Date,
  actualArrival: Date,
  responseTime: Number, // in minutes
  transportTime: Number, // in minutes
  totalTime: Number, // in minutes
  cost: {
    baseFare: {
      type: Number,
      default: 0
    },
    distanceFare: {
      type: Number,
      default: 0
    },
    emergencyFee: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'government']
    },
    transactionId: String,
    paidAt: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  isEmergency: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate unique request ID
emergencySchema.pre('save', async function(next) {
  if (!this.requestId) {
    const count = await mongoose.model('Emergency').countDocuments();
    this.requestId = `EMR-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Calculate priority based on severity and other factors
emergencySchema.pre('save', function(next) {
  const severityMap = {
    'critical': 5,
    'high': 4,
    'medium': 3,
    'low': 2
  };
  
  this.priority = severityMap[this.severityLevel] || 3;
  next();
});

// Add timeline entry on status change
emergencySchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Indexes for better query performance
emergencySchema.index({ status: 1, createdAt: -1 });
emergencySchema.index({ 'location.coordinates': '2dsphere' });
emergencySchema.index({ assignedAmbulance: 1 });
emergencySchema.index({ emergencyType: 1 });
emergencySchema.index({ severityLevel: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);