const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
    maxlength: [100, 'Hospital name cannot exceed 100 characters']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  type: {
    type: String,
    enum: ['public', 'private', 'specialized', 'military'],
    default: 'public'
  },
  level: {
    type: String,
    enum: ['level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6'],
    required: [true, 'Hospital level is required']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    emergencyLine: String,
    fax: String
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    county: {
      type: String,
      required: [true, 'County is required']
    },
    postalCode: String,
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  capacity: {
    totalBeds: {
      type: Number,
      required: [true, 'Total beds is required'],
      min: [1, 'Total beds must be at least 1']
    },
    availableBeds: {
      type: Number,
      required: [true, 'Available beds is required'],
      min: [0, 'Available beds cannot be negative']
    },
    icuBeds: {
      total: {
        type: Number,
        default: 0
      },
      available: {
        type: Number,
        default: 0
      }
    },
    emergencyBeds: {
      total: {
        type: Number,
        default: 0
      },
      available: {
        type: Number,
        default: 0
      }
    },
    pediatricBeds: {
      total: {
        type: Number,
        default: 0
      },
      available: {
        type: Number,
        default: 0
      }
    },
    maternityBeds: {
      total: {
        type: Number,
        default: 0
      },
      available: {
        type: Number,
        default: 0
      }
    }
  },
  departments: [{
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    head: String,
    contact: String,
    operatingHours: {
      start: String,
      end: String,
      is24Hours: {
        type: Boolean,
        default: false
      }
    }
  }],
  specialties: [{
    type: String,
    enum: [
      'emergency_medicine',
      'cardiology',
      'neurology',
      'orthopedics',
      'pediatrics',
      'obstetrics_gynecology',
      'surgery',
      'internal_medicine',
      'psychiatry',
      'radiology',
      'pathology',
      'anesthesiology',
      'oncology',
      'dermatology',
      'ophthalmology',
      'ent',
      'urology',
      'nephrology',
      'gastroenterology',
      'pulmonology'
    ]
  }],
  emergencyRoom: {
    status: {
      type: String,
      enum: ['open', 'busy', 'closed', 'diverted'],
      default: 'open'
    },
    capacity: {
      type: Number,
      default: 10
    },
    currentPatients: {
      type: Number,
      default: 0
    },
    averageWaitTime: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  staff: {
    doctors: {
      type: Number,
      default: 0
    },
    nurses: {
      type: Number,
      default: 0
    },
    paramedics: {
      type: Number,
      default: 0
    },
    support: {
      type: Number,
      default: 0
    }
  },
  equipment: [{
    name: String,
    quantity: Number,
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'broken'],
      default: 'operational'
    },
    lastMaintenance: Date
  }],
  services: [{
    name: String,
    isAvailable: {
      type: Boolean,
      default: true
    },
    cost: Number,
    description: String
  }],
  insurance: [{
    provider: String,
    isAccepted: {
      type: Boolean,
      default: true
    }
  }],
  ratings: {
    overall: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    staff: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    facilities: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  operatingHours: {
    monday: { start: String, end: String, is24Hours: Boolean },
    tuesday: { start: String, end: String, is24Hours: Boolean },
    wednesday: { start: String, end: String, is24Hours: Boolean },
    thursday: { start: String, end: String, is24Hours: Boolean },
    friday: { start: String, end: String, is24Hours: Boolean },
    saturday: { start: String, end: String, is24Hours: Boolean },
    sunday: { start: String, end: String, is24Hours: Boolean }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  administrator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Validate available beds don't exceed total beds
hospitalSchema.pre('save', function(next) {
  if (this.capacity.availableBeds > this.capacity.totalBeds) {
    this.capacity.availableBeds = this.capacity.totalBeds;
  }
  
  // Validate ICU beds
  if (this.capacity.icuBeds.available > this.capacity.icuBeds.total) {
    this.capacity.icuBeds.available = this.capacity.icuBeds.total;
  }
  
  // Validate emergency beds
  if (this.capacity.emergencyBeds.available > this.capacity.emergencyBeds.total) {
    this.capacity.emergencyBeds.available = this.capacity.emergencyBeds.total;
  }
  
  next();
});

// Calculate occupancy rate
hospitalSchema.methods.getOccupancyRate = function() {
  const occupied = this.capacity.totalBeds - this.capacity.availableBeds;
  return (occupied / this.capacity.totalBeds) * 100;
};

// Check if hospital can accept patients
hospitalSchema.methods.canAcceptPatients = function() {
  return this.isActive && 
         this.emergencyRoom.status !== 'closed' && 
         this.capacity.availableBeds > 0;
};

// Update bed availability
hospitalSchema.methods.updateBedAvailability = function(bedType, change) {
  if (bedType === 'general') {
    const newAvailable = this.capacity.availableBeds + change;
    this.capacity.availableBeds = Math.max(0, Math.min(newAvailable, this.capacity.totalBeds));
  } else if (this.capacity[bedType]) {
    const newAvailable = this.capacity[bedType].available + change;
    this.capacity[bedType].available = Math.max(0, Math.min(newAvailable, this.capacity[bedType].total));
  }
  return this.save();
};

// Calculate distance from a point
hospitalSchema.methods.distanceFrom = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.address.coordinates.latitude) * Math.PI / 180;
  const dLon = (longitude - this.address.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.address.coordinates.latitude * Math.PI / 180) *
    Math.cos(latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Indexes
hospitalSchema.index({ 'address.coordinates': '2dsphere' });
hospitalSchema.index({ 'emergencyRoom.status': 1 });
hospitalSchema.index({ type: 1, level: 1 });
hospitalSchema.index({ specialties: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);