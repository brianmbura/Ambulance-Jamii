const express = require('express');
const { body, validationResult } = require('express-validator');
const Emergency = require('../models/Emergency');
const Ambulance = require('../models/Ambulance');
const Hospital = require('../models/Hospital');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create emergency request
// @route   POST /api/emergency
// @access  Public
router.post('/', [
  body('patient.name').notEmpty().withMessage('Patient name is required'),
  body('patient.phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
  body('emergencyType').isIn([
    'cardiac_emergency', 'accident', 'respiratory_emergency', 'stroke', 
    'trauma', 'allergic_reaction', 'pregnancy', 'psychiatric', 'other'
  ]).withMessage('Valid emergency type is required'),
  body('severityLevel').isIn(['low', 'medium', 'high', 'critical']).withMessage('Valid severity level is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const emergencyData = {
      ...req.body,
      createdBy: req.user?.id || null
    };

    const emergency = await Emergency.create(emergencyData);

    // Emit real-time notification to dispatchers
    req.io.emit('new_emergency', {
      emergency: await emergency.populate('createdBy', 'name email')
    });

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      emergency: {
        id: emergency._id,
        requestId: emergency.requestId,
        status: emergency.status,
        estimatedArrival: emergency.estimatedArrival
      }
    });
  } catch (error) {
    console.error('Create emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating emergency request'
    });
  }
});

// @desc    Get all emergencies
// @route   GET /api/emergency
// @access  Private (Dispatcher, Admin)
router.get('/', protect, authorize(['dispatcher', 'super_admin']), async (req, res) => {
  try {
    const {
      status,
      severityLevel,
      emergencyType,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (severityLevel) filter.severityLevel = severityLevel;
    if (emergencyType) filter.emergencyType = emergencyType;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const emergencies = await Emergency.find(filter)
      .populate('assignedAmbulance', 'callSign type status')
      .populate('assignedDriver', 'name phone')
      .populate('destinationHospital', 'name address.street')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Emergency.countDocuments(filter);

    res.json({
      success: true,
      data: emergencies,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get emergencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching emergencies'
    });
  }
});

// @desc    Get emergency by ID
// @route   GET /api/emergency/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('assignedAmbulance', 'callSign type status currentLocation')
      .populate('assignedDriver', 'name phone profile')
      .populate('assignedDispatcher', 'name')
      .populate('destinationHospital', 'name address contact')
      .populate('createdBy', 'name email phone')
      .populate('timeline.updatedBy', 'name');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    // Check if user has permission to view this emergency
    const canView = req.user.role === 'super_admin' ||
                   req.user.role === 'dispatcher' ||
                   emergency.createdBy?.toString() === req.user.id ||
                   emergency.assignedDriver?.toString() === req.user.id;

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this emergency'
      });
    }

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    console.error('Get emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching emergency'
    });
  }
});

// @desc    Assign ambulance to emergency
// @route   PUT /api/emergency/:id/assign
// @access  Private (Dispatcher, Admin)
router.put('/:id/assign', protect, authorize(['dispatcher', 'super_admin']), [
  body('ambulanceId').notEmpty().withMessage('Ambulance ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { ambulanceId, estimatedArrival } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    if (emergency.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Emergency is not in pending status'
      });
    }

    const ambulance = await Ambulance.findById(ambulanceId).populate('assignedDriver');
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: 'Ambulance not found'
      });
    }

    if (!ambulance.isAvailableForAssignment()) {
      return res.status(400).json({
        success: false,
        message: 'Ambulance is not available for assignment'
      });
    }

    // Update emergency
    emergency.status = 'assigned';
    emergency.assignedAmbulance = ambulanceId;
    emergency.assignedDriver = ambulance.assignedDriver._id;
    emergency.assignedDispatcher = req.user.id;
    emergency.estimatedArrival = estimatedArrival || new Date(Date.now() + 15 * 60 * 1000); // 15 minutes default

    // Update ambulance
    ambulance.status = 'dispatched';
    ambulance.currentEmergency = emergency._id;

    await Promise.all([emergency.save(), ambulance.save()]);

    // Emit real-time updates
    req.io.emit('emergency_assigned', {
      emergencyId: emergency._id,
      ambulanceId: ambulance._id,
      driverId: ambulance.assignedDriver._id
    });

    res.json({
      success: true,
      message: 'Ambulance assigned successfully',
      data: {
        emergency: emergency._id,
        ambulance: ambulance.callSign,
        driver: ambulance.assignedDriver.name,
        estimatedArrival: emergency.estimatedArrival
      }
    });
  } catch (error) {
    console.error('Assign ambulance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error assigning ambulance'
    });
  }
});

// @desc    Update emergency status
// @route   PUT /api/emergency/:id/status
// @access  Private (Driver, Dispatcher, Admin)
router.put('/:id/status', protect, [
  body('status').isIn([
    'pending', 'assigned', 'dispatched', 'en_route', 'arrived',
    'patient_loaded', 'en_route_hospital', 'arrived_hospital', 'completed', 'cancelled'
  ]).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { status, notes, location } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    // Check authorization
    const canUpdate = req.user.role === 'super_admin' ||
                     req.user.role === 'dispatcher' ||
                     emergency.assignedDriver?.toString() === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this emergency'
      });
    }

    const oldStatus = emergency.status;
    emergency.status = status;

    // Add timeline entry
    emergency.timeline.push({
      status,
      timestamp: new Date(),
      location,
      notes,
      updatedBy: req.user.id
    });

    // Calculate response time if arriving
    if (status === 'arrived' && oldStatus !== 'arrived') {
      emergency.actualArrival = new Date();
      emergency.responseTime = Math.round((emergency.actualArrival - emergency.createdAt) / (1000 * 60));
    }

    // Calculate total time if completed
    if (status === 'completed') {
      emergency.totalTime = Math.round((new Date() - emergency.createdAt) / (1000 * 60));
      
      // Update ambulance status
      if (emergency.assignedAmbulance) {
        await Ambulance.findByIdAndUpdate(emergency.assignedAmbulance, {
          status: 'available',
          currentEmergency: null
        });
      }
    }

    await emergency.save();

    // Emit real-time update
    req.io.emit('emergency_status_updated', {
      emergencyId: emergency._id,
      status,
      timeline: emergency.timeline[emergency.timeline.length - 1]
    });

    res.json({
      success: true,
      message: 'Emergency status updated successfully',
      data: {
        status: emergency.status,
        responseTime: emergency.responseTime,
        totalTime: emergency.totalTime
      }
    });
  } catch (error) {
    console.error('Update emergency status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating emergency status'
    });
  }
});

// @desc    Get nearby ambulances for emergency
// @route   GET /api/emergency/:id/nearby-ambulances
// @access  Private (Dispatcher, Admin)
router.get('/:id/nearby-ambulances', protect, authorize(['dispatcher', 'super_admin']), async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    const { latitude, longitude } = emergency.location.coordinates;
    const maxDistance = parseInt(req.query.maxDistance) || 50; // km

    const nearbyAmbulances = await Ambulance.find({
      status: 'available',
      isActive: true,
      assignedDriver: { $exists: true },
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance * 1000 // Convert to meters
        }
      }
    }).populate('assignedDriver', 'name phone');

    // Calculate distances and estimated arrival times
    const ambulancesWithDetails = nearbyAmbulances.map(ambulance => {
      const distance = ambulance.distanceFrom(latitude, longitude);
      const estimatedTime = Math.round(distance * 2); // Rough estimate: 2 minutes per km
      
      return {
        id: ambulance._id,
        callSign: ambulance.callSign,
        type: ambulance.type,
        driver: ambulance.assignedDriver,
        location: ambulance.currentLocation,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        estimatedArrival: estimatedTime
      };
    });

    // Sort by distance
    ambulancesWithDetails.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: ambulancesWithDetails
    });
  } catch (error) {
    console.error('Get nearby ambulances error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby ambulances'
    });
  }
});

// @desc    Get emergency statistics
// @route   GET /api/emergency/stats
// @access  Private (Dispatcher, Admin)
router.get('/stats/overview', protect, authorize(['dispatcher', 'analytics_admin', 'super_admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Emergency.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalEmergencies: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          completedEmergencies: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingEmergencies: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          criticalEmergencies: {
            $sum: { $cond: [{ $eq: ['$severityLevel', 'critical'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalEmergencies: 0,
      avgResponseTime: 0,
      completedEmergencies: 0,
      pendingEmergencies: 0,
      criticalEmergencies: 0
    };

    // Calculate success rate
    result.successRate = result.totalEmergencies > 0 
      ? (result.completedEmergencies / result.totalEmergencies) * 100 
      : 0;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get emergency stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching emergency statistics'
    });
  }
});

module.exports = router;