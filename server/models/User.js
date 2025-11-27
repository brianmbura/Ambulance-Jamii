const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['public', 'dispatcher', 'driver', 'hospital_admin', 'analytics_admin', 'super_admin'],
    default: 'public'
  },
  phone: {
    type: String,
    required: function() {
      return this.role !== 'public';
    },
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profile: {
    avatar: String,
    address: String,
    emergencyContact: String,
    licenseNumber: String, // For drivers
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    }, // For hospital admins
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance'
    } // For drivers
  },
  permissions: [{
    type: String,
    enum: [
      'view_emergencies',
      'create_emergency',
      'assign_ambulance',
      'update_ambulance_status',
      'manage_hospital',
      'view_analytics',
      'manage_users',
      'process_payments'
    ]
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Set permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'dispatcher':
        this.permissions = ['view_emergencies', 'assign_ambulance', 'view_analytics'];
        break;
      case 'driver':
        this.permissions = ['view_emergencies', 'update_ambulance_status'];
        break;
      case 'hospital_admin':
        this.permissions = ['manage_hospital', 'view_emergencies'];
        break;
      case 'analytics_admin':
        this.permissions = ['view_analytics'];
        break;
      case 'super_admin':
        this.permissions = [
          'view_emergencies', 'create_emergency', 'assign_ambulance',
          'update_ambulance_status', 'manage_hospital', 'view_analytics',
          'manage_users', 'process_payments'
        ];
        break;
      default:
        this.permissions = ['create_emergency'];
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);